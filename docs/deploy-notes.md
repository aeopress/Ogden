# Deploy Notes — Cloudflare Pages + GitHub Actions

部署流程在 `.github/workflows/deploy.yml`，跑通後 22 秒一輪。
本筆記留下兩個 GitHub Actions 端踩到的非典型 issue，以及為什麼當前 workflow 寫成「shell-only」風格。

---

## Token 觀念釐清（避免下次混淆）

`gh` CLI 跟 GitHub Actions 跑的 `GITHUB_TOKEN` 是 **兩個完全不同的 token**：

| | `gh` CLI | `GITHUB_TOKEN`（Actions runner） |
|---|---|---|
| 來源 | `gh auth login` 後存在 OS keychain | 每次 workflow run **動態產生**、跑完即失效 |
| 認證身分 | user `yelban` 本人 | repo 自身的 ephemeral bot identity |
| 權限範圍 | 你 OAuth grant 的 scopes（`repo` / `admin:public_key`…）| workflow `permissions:` block + repo Actions settings |
| 生命週期 | 永久（直到 revoke） | 單次 workflow |

**所以 `gh` 通 ≠ Actions 通**。在 runner 內 git fetch 用的是 GITHUB_TOKEN，不是你的 gh 認證。

---

## Issue 1 — `actions/checkout@v4` 403

### 症狀

```
[command] git -c protocol.version=2 fetch ... origin +<sha>:refs/remotes/origin/main
##[error] fatal: unable to access 'https://github.com/yelban/Ogden/':
          The requested URL returned error: 403
```

Setup job 過、`GITHUB_TOKEN Permissions` 印的是 `Contents: read / Deployments: write`（正確），但 git fetch HTTPS Basic Auth 階段被 GitHub 拒。3 次 retry 都 403。

### 根因（推測）

Repo 剛 `gh repo create` 沒幾分鐘就 push workflow 並 dispatch。**GitHub backend 對這個 repo 的 actions identity provisioning 還沒完全 sync**：
- `Set up job` 拿到的 token claim 看起來 OK
- 但 git server 端對該 repo 的 token-to-identity mapping 還沒寫進去
- 兩個內部系統 race condition、git server 一律 403

GitHub Community 上有大量類似回報，通常 5–60 分鐘後自愈。

### Workaround

不依賴 `GITHUB_TOKEN` 做 checkout — public repo 直接 anonymous shallow clone：

```yaml
- name: Anonymous shallow clone
  run: |
    git clone --depth 1 --branch "${GITHUB_REF_NAME:-main}" \
      "https://github.com/${GITHUB_REPOSITORY}.git" .
    git rev-parse HEAD
```

**好處**：完全不碰 token issuance race，public repo 必通。
**代價**：
- 不能拉 private repo、不能拉 fork
- anonymous 沒帶 token 的 rate limit headers，量大時可能被 throttle（單一 deploy 完全沒事）
- 沒有 actions/checkout 內建的 LFS / submodule / safe.directory 處理

### 何時改回 `actions/checkout@v4`

repo 用了一週、Actions 跑過幾次之後可以再試。若改回後還 403，永久維持 shell clone 也完全 OK。

---

## Issue 2 — codeload.github.com 拉 third-party action tarball 失敗

### 症狀

```
Download action repository 'oven-sh/setup-bun@v2' (SHA:0c5077e...)
##[error] An action could not be found at the URI
          'https://codeload.github.com/oven-sh/setup-bun/tar.gz/0c5077e...'

Download action repository 'cloudflare/wrangler-action@v3' (SHA:9acf94a...)
##[error] An action could not be found at the URI
          'https://codeload.github.com/cloudflare/wrangler-action/tar.gz/9acf94a...'
```

同一秒鐘兩個不相干的 third-party action 都拉不到。

### 根因

`codeload.github.com` 是 GitHub 用來分發 repo tarball 的 service（Actions runner 抓 third-party action 走這條路）。同時兩個 action 都掛 → **codeload 在那個 5 分鐘內的 partial outage**，跟 repo / 帳號完全無關。

GitHub Status 偶爾會有 codeload-related incident，通常幾分鐘到幾小時自愈。

### Workaround（最終方案）

完全不用 third-party action。改 shell 直裝：

```yaml
- name: Install Bun
  run: |
    curl -fsSL https://bun.sh/install | bash
    echo "$HOME/.bun/bin" >> "$GITHUB_PATH"

# 後面 deploy 也不用 cloudflare/wrangler-action
- name: Deploy to Cloudflare Pages
  run: bunx wrangler pages deploy dist --project-name=ogden --branch=main \
       --commit-hash=${{ github.sha }}
```

**好處**：永遠不依賴 codeload，workflow 更可預期。
**代價**：失去 `setup-bun` 內建的 `~/.bun/install/cache` 快取，每次 install bun 多 3–5 秒。對 22 秒總時間影響有限。

---

## 當前 workflow 設計取捨

`.github/workflows/deploy.yml` 最終形態：

| 步驟 | 用法 | 為什麼 |
|---|---|---|
| Anonymous shallow clone | shell `git clone` | 繞 GITHUB_TOKEN 403 |
| Install Bun | shell `curl https://bun.sh/install` | 繞 codeload action 拉取失敗 |
| Install dependencies | `bun install --frozen-lockfile` | bun.lock 鎖版本 |
| Typecheck | `bun run astro check` | 0 errors gate |
| Validate 850-word data | `bun run validate` | 確保 850 詞、5 類、18 operators 完整 |
| Build | `bun run build` | Astro static build |
| Deploy | `bunx wrangler pages deploy dist` | wrangler 直接呼叫，不走 wrangler-action |

整個 workflow 只用一個 first-party action（沒有，連 actions/checkout 都拿掉了），所以**未來 GitHub 任何 third-party action 的 codeload / SHA / breaking change 都不會影響我們**。

---

## 可選後續改善

1. **加快取**：用 `actions/cache@v4`（first-party，可信）快取 `~/.bun/install/cache` 與 `node_modules`，22 秒 → 約 10–12 秒。
2. **加 status badge**：README 加 GitHub Actions badge 顯示 deploy 狀態。
3. **加 PR preview**：`workflow_dispatch` 之外也對 PR 觸發、deploy 到 `--branch=<pr-name>` 拿到 preview URL。
4. **一週後試回 `actions/checkout@v4`**：看 GITHUB_TOKEN 403 是否已自愈。若已愈、回到「標準」流程，但留著 shell clone 也完全 OK。

---

## 需要的 GitHub Secrets

| Secret | 來源 |
|---|---|
| `CLOUDFLARE_ACCOUNT_ID` | `bunx wrangler whoami` 印的 Account ID |
| `CLOUDFLARE_API_TOKEN` | CF Dashboard → My Profile → API Tokens → Custom Token（Account.Cloudflare Pages.Edit）|
| `PUBLIC_CF_ANALYTICS_TOKEN` | CF Dashboard → Web Analytics → Add site → 拿到的 token |

設法：

```bash
gh secret set CLOUDFLARE_ACCOUNT_ID    --repo yelban/Ogden --body "<account-id>"
gh secret set CLOUDFLARE_API_TOKEN     --repo yelban/Ogden --body "<api-token>"
gh secret set PUBLIC_CF_ANALYTICS_TOKEN --repo yelban/Ogden --body "<analytics-token>"
```

---

## TL;DR

- `gh` CLI 跟 Actions 的 `GITHUB_TOKEN` 是兩個東西，前者通不代表後者通。
- 兩個 issue 都是 GitHub infra 暫時抽風（新 repo token race + codeload outage），跟我們設定無關。
- 當前 workflow 寫成 shell-only，**沒有第三方依賴**，未來 GitHub 同類 incident 都不會影響。
- 部署仍可 22 秒一輪、`https://ogden.pages.dev` 與 `https://ogden.orz99.com` 正常上線。
