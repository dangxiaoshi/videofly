# PodVid 开发日志

## 2026-04-09 · 环境修复 + 登录上线

### 问题
- 网站可访问（CDN缓存），但登录完全失败（Google OAuth + Magic Link 均报错）
- 根本原因：Vercel 项目 env 变量一个都没配

### 修复过程
1. 通过 `vercel link` 找到项目（在团队 `huihuigift-6409s-projects` 下）
2. CLI 批量设置 18 个环境变量
3. 修复 `RESEND_FROM`（需要已验证域名，改用 `onboarding@resend.dev`）
4. 修复 `NEXT_PUBLIC_APP_URL`（改为 `https://podvid.vercel.app`）
5. 修复 `DATABASE_URL`（去掉 `channel_binding=require` 参数）

### owner-mode 分支
针对自用场景，新增绕过登录和积分的模式：

**env 配置：**
```
OWNER_MODE=true
OWNER_EMAIL=your@email.com
NEXT_PUBLIC_OWNER_MODE=true
IS_DEBUG=true
```

**改动：**
- `src/lib/api/auth.ts`：OWNER_MODE 时用 OWNER_EMAIL 账号绕过 session 验证
- `src/services/video.ts`：IS_DEBUG 积分绕过去掉 NODE_ENV 限制（生产环境也生效）
- `src/components/tool/tool-page-layout.tsx`：OWNER_MODE 时跳过前端登录跳转和积分检查

### 当前状态
- ✅ 登录：podvid.vercel.app（Magic Link）
- ✅ owner-mode 已部署
- ⚠️ www.podvid.uk 域名待迁移
- ⚠️ 中文 locale 切换 404
- ❌ 视频生成待测试

## 2026-04-03 · 初始构建通过

- pnpm typecheck / lint / build 全部通过
- Neon DB、Cloudflare R2 配置完成
- Google OAuth Client ID 配置
- APIMart 接入（Seedance / Sora / Wan）
