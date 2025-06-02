// security-check.js - 安全防护模块
document.addEventListener('DOMContentLoaded', function() {
    // 常量配置（全大写命名，便于维护）
    const SECURITY_CONFIG = {
        // HTTPS强制跳转（开发环境可关闭）
        FORCE_HTTPS: true,
        // UA黑名单关键词（按需更新）
        BLOCKED_USER_AGENTS: [
            'bot', 'spider', 'curl', 'wget', 'python', 'scraper',
            'nikto', 'sqlmap', 'nmap', 'zmeu', 'hydra'
        ],
        // 合法来源域名白名单（支持子域名）
        ALLOWED_DOMAINS: [
            'https://bbsky3099.github.io/code_validator',
            'trusted-site.com'
        ]
    };

    /* 执行安全检测流程 */
    const runSecurityChecks = () => {
        // 阶段1: HTTPS强制跳转（最高优先级）
        if (SECURITY_CONFIG.FORCE_HTTPS && window.location.protocol === 'http:') {
            return redirectToHttps();
        }

        // 阶段2: User-Agent检测
        if (isMaliciousUserAgent()) {
            return redirectToErrorPage(403);
        }

        // 阶段3: Referer来源验证
        if (!isValidReferer()) {
            return redirectToErrorPage(403);
        }
    };

    /* 工具函数 */
    // HTTPS跳转（使用replace避免历史记录）
    const redirectToHttps = () => {
        window.location.replace(`https://${window.location.host}${window.location.pathname}`);
    };

    // 错误页跳转（支持扩展状态码）
    const redirectToErrorPage = (statusCode = 403) => {
        const pageMap = { 403: '/403.html', 404: '/404.html' };
        window.location.href = pageMap[statusCode] || '/403.html';
    };

    // UA检测逻辑
    const isMaliciousUserAgent = () => {
        const userAgent = navigator.userAgent.toLowerCase();
        return SECURITY_CONFIG.BLOCKED_USER_AGENTS.some(keyword => 
            userAgent.includes(keyword)
        );
    };

    // Referer验证逻辑
    const isValidReferer = () => {
        const referrer = document.referrer.toLowerCase();
        
        // 允许直接访问（无Referer）
        if (!referrer) return true;

        // 检查白名单域名
        return SECURITY_CONFIG.ALLOWED_DOMAINS.some(domain => 
            referrer.includes(domain)
        );
    };

    /* 执行主流程 */
    runSecurityChecks();
});