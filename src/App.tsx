import { useState, useEffect, useRef, type RefObject, type MouseEvent } from "react";
import logoImage from "./assets/logo.png";
import founderImage from "./assets/khasim_image.png";

type Particle = {
  x: number;
  y: number;
  r: number;
  c: string;
  a: number;
  vx: number;
  vy: number;
};

/* ─────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,800;1,9..144,700&display=swap');
    *{margin:0;padding:0;box-sizing:border-box}
    html, body, #root{width:100%;min-height:100%}
    html{scroll-behavior:smooth}
    body{font-family:'Plus Jakarta Sans',sans-serif;background:#FAFAF8;color:#1A1A2E;line-height:1.6;overflow-x:hidden;margin:0}
    :root{
      --primary:#1A3C6E;--accent:#F97316;--accent2:#0EA5E9;
      --bg:#FAFAF8;--surface:#fff;--text:#1A1A2E;--muted:#6B7280;
      --border:#E5E7EB;--radius:12px;
    }

    /* NAV */
    .nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(250,250,248,0.94);backdrop-filter:blur(14px);border-bottom:1px solid var(--border);padding:0;transition:all .35s}
    .nav.scrolled{background:rgba(255,255,255,0.98);box-shadow:0 4px 24px rgba(0,0,0,0.08)}
    .nav-inner{width:100%;max-width:none;margin:0;display:flex;align-items:center;justify-content:space-between;height:76px;transition:height .35s}
    .nav.scrolled .nav-inner{height:62px}
    .nav-logo{display:flex;align-items:center;gap:16px;text-decoration:none;cursor:pointer}
    .logo-mark{width:80px;height:80px;flex-shrink:0;border-radius:32px;overflow:hidden;filter:drop-shadow(0 6px 18px rgba(26,60,110,0.25));transition:all .3s ease}
    .nav-logo:hover .logo-mark{transform:rotate(-6deg) scale(1.08);filter:drop-shadow(0 8px 24px rgba(249,115,22,0.4))}
    .logo-text-wrap{display:flex;flex-direction:column;gap:1px}
    .logo-name{font-weight:800;font-size:18px;color:var(--primary);letter-spacing:-.4px;line-height:1.1}
    .logo-tag{font-size:10px;font-weight:600;color:var(--accent);letter-spacing:.1em;text-transform:uppercase}
    .nav-links{display:flex;gap:28px;list-style:none}
    .nav-links a{text-decoration:none;font-size:14px;font-weight:500;color:var(--muted);transition:color .2s;cursor:pointer}
    .nav-links a:hover{color:var(--primary)}
    .nav-cta{background:var(--primary);color:#fff;padding:9px 20px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none;transition:all .2s;cursor:pointer}
    .nav-cta:hover{background:#0f2a52}
    .hamburger{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:4px;background:none;border:none}
    .hamburger span{width:22px;height:2px;background:var(--primary);border-radius:2px;transition:all .3s;display:block}
    .mobile-menu{display:none;position:fixed;top:76px;left:0;right:0;background:#fff;border-bottom:1px solid var(--border);padding:20px;z-index:99;flex-direction:column;gap:16px}
    .mobile-menu.open{display:flex}
    .mobile-menu a{font-size:15px;font-weight:500;color:var(--text);text-decoration:none;padding:8px 0;border-bottom:1px solid var(--border);cursor:pointer}

    /* HERO */
    .hero{min-height:100vh;display:flex;align-items:center;padding:120px 0 80px;position:relative;overflow:hidden;width:100vw;left:50%;margin-left:-50vw;box-sizing:border-box}
    .hero-glow-a{position:absolute;top:-200px;right:-200px;width:700px;height:700px;background:radial-gradient(circle,rgba(14,165,233,0.07) 0%,transparent 65%);pointer-events:none}
    .hero-glow-b{position:absolute;bottom:-100px;left:-100px;width:500px;height:500px;background:radial-gradient(circle,rgba(249,115,22,0.05) 0%,transparent 65%);pointer-events:none}
    #hero-canvas{position:absolute;inset:0;pointer-events:none;z-index:0}
    .hero-inner{width:100%;max-width:none;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;position:relative;z-index:1;padding:0 5%;box-sizing:border-box}
    .hero-badge{display:inline-flex;align-items:center;gap:8px;background:#EFF6FF;border:1px solid #BFDBFE;color:#1D4ED8;font-size:12px;font-weight:600;padding:6px 14px;border-radius:20px;letter-spacing:.04em;text-transform:uppercase;margin-bottom:24px}
    .pulse-dot{width:6px;height:6px;background:#22C55E;border-radius:50%;animation:pulseDot 2s infinite}
    @keyframes pulseDot{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.6);opacity:.4}}
    .hero-h1{font-family:'Fraunces',serif;font-size:56px;font-weight:800;line-height:1.05;color:var(--primary);margin-bottom:20px;letter-spacing:-.5px}
    .hero-h1 em{font-style:italic;color:var(--accent)}
    .hero-sub{font-size:16px;color:var(--muted);line-height:1.8;margin-bottom:36px;max-width:480px;overflow-wrap:anywhere;word-break:break-word;white-space:normal}
    .hero-btns{display:flex;gap:14px;flex-wrap:wrap}
    .btn-primary{background:var(--primary);color:#fff;padding:13px 26px;border-radius:10px;font-size:15px;font-weight:600;text-decoration:none;transition:all .2s;display:inline-flex;align-items:center;gap:8px;cursor:pointer;border:none}
    .btn-primary:hover{background:#0f2a52;transform:translateY(-2px)}
    .btn-wa{background:#25D366;color:#fff;padding:13px 26px;border-radius:10px;font-size:15px;font-weight:600;text-decoration:none;transition:all .2s;display:inline-flex;align-items:center;gap:8px;cursor:pointer}
    .btn-wa:hover{background:#1ebe5a;transform:translateY(-2px)}
    .hero-stats{display:flex;gap:28px;margin-top:44px;padding-top:28px;border-top:1px solid var(--border);flex-wrap:wrap}
    .stat-num{font-size:26px;font-weight:800;color:var(--primary)}
    .stat-label{font-size:12px;color:var(--muted);font-weight:500;margin-top:2px}
    .hero-visual{position:relative}
    .hero-card{background:#fff;border:1px solid var(--border);border-radius:16px;padding:28px;box-shadow:0 20px 60px rgba(0,0,0,0.07)}
    .hero-card-brand{display:flex;align-items:center;gap:14px;margin-bottom:20px;padding-bottom:18px;border-bottom:1px solid var(--border)}
    .hcb-logo{width:58px;height:58px;flex-shrink:0;filter:drop-shadow(0 6px 16px rgba(26,60,110,0.28))}
    .hcb-name{font-size:16px;font-weight:800;color:var(--primary);letter-spacing:-.3px}
    .hcb-sub{font-size:12px;color:var(--muted);margin-top:2px}
    .hcb-badge{display:inline-flex;align-items:center;gap:4px;background:#F0FDF4;border:1px solid #BBF7D0;color:#166534;font-size:10px;font-weight:600;padding:2px 8px;border-radius:8px;margin-top:5px}
    .pill{font-size:11px;font-weight:600;padding:4px 11px;border-radius:20px;letter-spacing:.03em}
    .pill-blue{background:#EFF6FF;color:#1D4ED8}
    .pill-orange{background:#FFF7ED;color:#C2410C}
    .pill-green{background:#F0FDF4;color:#166534}
    .pill-purple{background:#F5F3FF;color:#6D28D9}
    .pills-wrap{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:16px}
    .mini-bar{height:6px;border-radius:3px;background:#F3F4F6;margin-bottom:8px;overflow:hidden}
    .mini-bar-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,var(--primary),var(--accent2));width:0%;transition:width 1.4s cubic-bezier(.4,0,.2,1)}
    .ft{position:absolute;background:#fff;border:1px solid var(--border);border-radius:10px;padding:9px 13px;box-shadow:0 8px 24px rgba(0,0,0,0.09);font-size:12px;font-weight:600;color:var(--primary);display:flex;align-items:center;gap:6px}
    .ft1{top:-18px;right:-18px;animation:floatA 4s ease-in-out infinite}
    .ft2{bottom:18px;left:-28px;animation:floatB 5s ease-in-out infinite 1s}
    @keyframes floatA{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-10px) rotate(2deg)}}
    @keyframes floatB{0%,100%{transform:translateY(0) rotate(1deg)}50%{transform:translateY(-8px) rotate(-3deg)}}
    .ft-dot{width:7px;height:7px;border-radius:50%}

    /* SECTIONS */
    section{padding:88px 0;width:100vw;left:50%;margin-left:-50vw;position:relative;box-sizing:border-box}
    .sec-inner{width:100%;max-width:none;margin:0 auto;padding:0 5%}
    .sec-label{font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:var(--accent);margin-bottom:10px}
    .sec-title{font-family:'Fraunces',serif;font-size:38px;font-weight:800;color:var(--primary);line-height:1.15;margin-bottom:14px}
    .sec-sub{font-size:15px;color:var(--muted);max-width:540px;line-height:1.75;overflow-wrap:anywhere;word-break:break-word;white-space:normal}
    .sec-head{margin-bottom:52px}

    /* ABOUT — complete redesign */
    #about{background:#fff}
    .about-team-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:1px solid var(--border);border-radius:16px;overflow:hidden;margin-bottom:56px;background:#fff}
    .ats-item{padding:28px 24px;text-align:center;border-right:1px solid var(--border);position:relative}
    .ats-item:last-child{border-right:none}
    .ats-num{font-family:'Fraunces',serif;font-size:42px;font-weight:800;color:var(--primary);line-height:1}
    .ats-accent{color:var(--accent)}
    .ats-label{font-size:13px;color:var(--muted);font-weight:500;margin-top:6px;line-height:1.4}
    .ats-bar{height:3px;background:linear-gradient(90deg,var(--primary),var(--accent2));margin-top:16px;border-radius:2px;opacity:.35}
    .about-audience{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:48px}
    .aa-card{border:1px solid var(--border);border-radius:var(--radius);padding:28px;background:var(--bg);position:relative;overflow:hidden;transition:all .28s}
    .aa-card::after{content:'';position:absolute;bottom:0;left:0;right:0;height:3px;opacity:0;transition:opacity .28s}
    .aa-card:hover{transform:translateY(-4px);box-shadow:0 20px 48px rgba(0,0,0,0.08)}
    .aa-card:hover::after{opacity:1}
    .aa-biz::after{background:linear-gradient(90deg,var(--primary),var(--accent2))}
    .aa-stu::after{background:linear-gradient(90deg,var(--accent),#FBBF24)}
    .aa-col::after{background:linear-gradient(90deg,#8B5CF6,#EC4899)}
    .aa-icon-wrap{width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:24px;margin-bottom:16px}
    .aa-card h3{font-size:16px;font-weight:700;color:var(--primary);margin-bottom:8px}
    .aa-card p{font-size:13px;color:var(--muted);line-height:1.75;margin-bottom:14px}
    .aa-points{display:flex;flex-direction:column;gap:7px}
    .aa-point{display:flex;align-items:flex-start;gap:8px;font-size:12px;color:var(--text);font-weight:500}
    .aa-check{width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:9px;margin-top:1px}
    .about-team-row{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}
    .atr-visual{position:relative}
    .atr-logo-bg{background:linear-gradient(135deg,#EFF6FF,#DBEAFE);border-radius:24px;aspect-ratio:1;max-width:360px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;margin:0 auto}
    .atr-wm{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:.05}
    .atr-center{display:flex;flex-direction:column;align-items:center;gap:12px;position:relative}
    .atr-logo-main{animation:floatLogo 6s ease-in-out infinite;filter:drop-shadow(0 10px 28px rgba(26,60,110,0.3))}
    @keyframes floatLogo{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
    .atr-founder-name{font-size:18px;font-weight:700;color:var(--primary)}
    .atr-founder-role{font-size:13px;color:var(--muted);font-weight:500}
    .atr-badge{background:var(--primary);color:#fff;font-size:11px;font-weight:600;padding:5px 14px;border-radius:12px;letter-spacing:.04em}
    .atr-content{}
    .atr-content h3{font-size:26px;font-weight:700;color:var(--primary);margin-bottom:14px;line-height:1.3}
    .atr-content p{font-size:15px;color:var(--muted);line-height:1.8;margin-bottom:16px}
    .ah-item{display:flex;align-items:center;gap:10px;font-size:14px;color:var(--text);font-weight:500;margin-bottom:10px}
    .ah-dot{width:8px;height:8px;border-radius:50%;background:var(--accent);flex-shrink:0}

    /* SERVICES */
    #services{background:var(--bg)}
    .services-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
    .service-card{border:1px solid var(--border);border-radius:var(--radius);padding:28px;background:#fff;position:relative;overflow:hidden;transition:all .25s}
    .service-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;border-radius:var(--radius) var(--radius) 0 0;opacity:0;transition:opacity .25s}
    .service-card:hover{transform:translateY(-4px);box-shadow:0 20px 48px rgba(0,0,0,0.08)}
    .service-card:hover::before{opacity:1}
    .sc-web::before{background:linear-gradient(90deg,var(--primary),var(--accent2))}
    .sc-mob::before{background:linear-gradient(90deg,var(--accent),#FBBF24)}
    .sc-train::before{background:linear-gradient(90deg,#8B5CF6,#EC4899)}
    .svc-icon{width:50px;height:50px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:18px}
    .service-card h3{font-size:17px;font-weight:700;color:var(--primary);margin-bottom:9px}
    .service-card p{font-size:13px;color:var(--muted);line-height:1.7;margin-bottom:14px}
    .stags{display:flex;flex-wrap:wrap;gap:5px}
    .stag{font-size:10px;font-weight:500;padding:3px 8px;border-radius:5px;background:#F3F4F6;color:var(--muted)}

    /* PORTFOLIO */
    #portfolio{background:#fff}
    .portfolio-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
    .proj-card{border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;transition:all .25s;background:var(--bg)}
    .proj-card:hover{transform:translateY(-4px);box-shadow:0 20px 48px rgba(0,0,0,0.08)}
    .proj-thumb{height:160px;display:flex;align-items:center;justify-content:center;font-size:42px}
    .proj-body{padding:20px}
    .proj-badge{font-size:10px;font-weight:600;padding:3px 9px;border-radius:10px;margin-bottom:10px;display:inline-block;letter-spacing:.04em;text-transform:uppercase}
    .proj-body h3{font-size:15px;font-weight:700;color:var(--primary);margin-bottom:7px}
    .proj-body p{font-size:12px;color:var(--muted);line-height:1.65;margin-bottom:12px}
    .proj-stack{display:flex;flex-wrap:wrap;gap:5px}
    .pstack{font-size:10px;font-weight:500;padding:2px 7px;border-radius:4px;background:#F3F4F6;color:var(--muted)}
    .proj-result{font-size:11px;font-weight:600;color:var(--accent);margin-top:10px}

    /* TRAINING */
    #training{background:var(--bg)}
    .training-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
    .tr-card{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:24px;display:flex;gap:18px;align-items:flex-start;transition:all .25s}
    .tr-card:hover{transform:translateY(-3px);box-shadow:0 16px 40px rgba(0,0,0,0.07)}
    .tr-icon{width:46px;height:46px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
    .tr-body h3{font-size:15px;font-weight:700;color:var(--primary);margin-bottom:5px}
    .tr-meta{display:flex;gap:12px;margin-bottom:8px}
    .tr-meta span{font-size:11px;color:var(--muted)}
    .tr-body p{font-size:12px;color:var(--muted);line-height:1.65;margin-bottom:10px}
    .tr-topics{display:flex;flex-wrap:wrap;gap:5px}
    .cert-badge{display:inline-flex;align-items:center;gap:5px;background:#F0FDF4;border:1px solid #BBF7D0;color:#166534;font-size:10px;font-weight:600;padding:3px 9px;border-radius:10px;margin-top:10px;letter-spacing:.03em}
    .pricing-note{background:#FFFBEB;border:1px solid #FDE68A;border-radius:8px;padding:10px 14px;font-size:12px;color:#92400E;font-weight:500;margin-top:10px}

    /* PRICING */
    #pricing{background:#fff}
    .pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
    .price-card{border:1.5px solid var(--border);border-radius:16px;padding:28px;text-align:center;transition:all .25s;background:var(--bg);position:relative}
    .price-card.featured{border-color:var(--primary);background:#fff;transform:translateY(-8px);box-shadow:0 24px 60px rgba(26,60,110,0.12)}
    .price-card.featured::before{content:'Most Popular';position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--primary);color:#fff;font-size:10px;font-weight:700;padding:4px 14px;border-radius:12px;letter-spacing:.06em;text-transform:uppercase;white-space:nowrap}
    .pc-icon{font-size:32px;margin-bottom:14px}
    .pc-name{font-size:16px;font-weight:700;color:var(--primary);margin-bottom:6px}
    .pc-price{font-family:'Fraunces',serif;font-size:36px;font-weight:800;color:var(--primary);margin-bottom:4px}
    .pc-price span{font-size:14px;font-weight:500;color:var(--muted);font-family:'Plus Jakarta Sans',sans-serif}
    .pc-desc{font-size:12px;color:var(--muted);margin-bottom:20px;line-height:1.6}
    .pc-features{list-style:none;text-align:left;margin-bottom:22px;display:flex;flex-direction:column;gap:9px}
    .pc-features li{font-size:13px;color:var(--text);display:flex;align-items:flex-start;gap:8px}
    .pc-features li::before{content:'✓';color:#22C55E;font-weight:700;flex-shrink:0}
    .pc-btn{display:block;padding:12px;border-radius:9px;font-size:14px;font-weight:600;text-decoration:none;transition:all .2s;text-align:center;cursor:pointer}
    .pc-btn-primary{background:var(--primary);color:#fff;border:none}
    .pc-btn-primary:hover{background:#0f2a52}
    .pc-btn-outline{background:transparent;color:var(--primary);border:1.5px solid var(--primary)}
    .pc-btn-outline:hover{background:#EFF6FF}

    /* COLLEGE */
    #college{background:var(--bg)}
    .college-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
    .col-card{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:22px;text-align:center;transition:all .25s}
    .col-card:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,0.07)}
    .col-icon{font-size:32px;margin-bottom:12px}
    .col-card h3{font-size:14px;font-weight:700;color:var(--primary);margin-bottom:7px}
    .col-card p{font-size:12px;color:var(--muted);line-height:1.65}

    /* TESTIMONIALS */
    #testimonials{background:#fff}
    .test-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
    .tcard{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:24px;transition:all .25s}
    .tcard:hover{box-shadow:0 24px 60px rgba(26,60,110,0.1);transform:translateY(-3px)}
    .tcard-stars{color:#F59E0B;font-size:14px;margin-bottom:12px;letter-spacing:2px}
    .tcard p{font-size:13px;color:var(--text);line-height:1.7;margin-bottom:16px;font-style:italic}
    .tcard-author{display:flex;align-items:center;gap:10px}
    .tcard-av{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;color:#fff;flex-shrink:0}
    .tcard-name{font-size:13px;font-weight:600;color:var(--primary)}
    .tcard-role{font-size:11px;color:var(--muted)}

    /* WHY */
    #why{background:var(--primary);padding:88px 0;position:relative;overflow:hidden;width:100vw;left:50%;margin-left:-50vw;box-sizing:border-box}
    .why-logo-bg{position:absolute;right:-80px;top:50%;transform:translateY(-50%);opacity:.05;pointer-events:none}
    #why .sec-label{color:rgba(249,115,22,0.9)}
    #why .sec-title{color:#fff}
    #why .sec-sub{color:rgba(255,255,255,0.55)}
    .why-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;position:relative;z-index:1}
    .why-card{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:var(--radius);padding:26px;text-align:center;transition:all .28s}
    .why-card:hover{transform:translateY(-5px);background:rgba(255,255,255,0.14)}
    .wc-num{font-family:'Fraunces',serif;font-size:40px;font-weight:800;color:var(--accent);line-height:1;margin-bottom:8px}
    .why-card h3{font-size:13px;font-weight:600;color:#fff;margin-bottom:5px}
    .why-card p{font-size:11px;color:rgba(255,255,255,0.45);line-height:1.6}

    /* FAQ */
    #faq{background:var(--bg)}
    .faq-list{display:flex;flex-direction:column;gap:10px;max-width:760px;margin-top:48px}
    .faq-item{background:#fff;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}
    .faq-q{padding:18px 22px;font-size:14px;font-weight:600;color:var(--primary);cursor:pointer;display:flex;justify-content:space-between;align-items:center;user-select:none;background:none;border:none;width:100%;text-align:left}
    .faq-q:hover{background:#FAFAF8}
    .faq-icon{font-size:18px;color:var(--muted);transition:transform .3s}
    .faq-icon.open{transform:rotate(45deg)}
    .faq-a{padding:0 22px 18px;font-size:13px;color:var(--muted);line-height:1.75}

    /* CONTACT */
    #contact{background:#fff}
    .contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:start}
    .ci-icon{width:40px;height:40px;background:#EFF6FF;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0}
    .ci-label{font-size:10px;font-weight:600;color:var(--muted);letter-spacing:.06em;text-transform:uppercase;margin-bottom:1px}
    .ci-value{font-size:14px;font-weight:600;color:var(--primary)}
    .contact-form{background:var(--bg);border:1px solid var(--border);border-radius:16px;padding:28px}
    .form-group{margin-bottom:15px}
    .form-group label{display:block;font-size:11px;font-weight:600;color:var(--primary);letter-spacing:.05em;text-transform:uppercase;margin-bottom:6px}
    .form-group input,.form-group select,.form-group textarea{width:100%;padding:10px 13px;border:1.5px solid var(--border);border-radius:8px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;color:var(--text);background:#fff;transition:border-color .2s;outline:none}
    .form-group input:focus,.form-group select:focus,.form-group textarea:focus{border-color:var(--primary)}
    .form-group textarea{resize:vertical;min-height:90px}
    .form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .form-submit{width:100%;padding:13px;background:var(--primary);color:#fff;border:none;border-radius:9px;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all .2s}
    .form-submit:hover{background:#0f2a52;transform:translateY(-1px)}
    .form-success{background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;padding:14px;text-align:center;font-size:14px;color:#166534;font-weight:600;margin-top:12px}

    /* FOOTER */
    footer{background:#0A1628;padding:48px 0 36px;position:relative;width:100vw;left:50%;right:50%;margin-left:-50vw;margin-right:-50vw;box-sizing:border-box}
    .footer-inner{width:100%;max-width:none;margin:0 auto;padding:0 5%}
    .footer-top{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:24px;margin-bottom:32px;padding-bottom:32px;border-bottom:1px solid rgba(255,255,255,0.08)}
    .fb-logo{display:flex;align-items:center;gap:14px;margin-bottom:12px}
    .fb-logo-box{filter:drop-shadow(0 4px 16px rgba(249,115,22,0.35))}
    .fb-name{font-weight:800;font-size:18px;color:#fff;letter-spacing:-.3px;line-height:1.1}
    .fb-tagline{font-size:11px;color:var(--accent);font-weight:600;letter-spacing:.08em;text-transform:uppercase;margin-top:2px}
    .footer-brand > p{font-size:12px;color:rgba(255,255,255,0.35);max-width:240px;line-height:1.75;margin-top:4px}
    .footer-col h4{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-bottom:12px}
    .footer-col a{display:block;font-size:12px;color:rgba(255,255,255,0.4);text-decoration:none;margin-bottom:8px;transition:color .2s;cursor:pointer}
    .footer-col a:hover{color:#fff}
    .footer-bottom{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px}
    .footer-copy{font-size:12px;color:rgba(255,255,255,0.25)}
    .footer-bottom-links{display:flex;gap:20px}
    .footer-bottom-links a{font-size:12px;color:rgba(255,255,255,0.25);text-decoration:none}

    /* WHATSAPP */
    .wa-btn{position:fixed;bottom:28px;right:28px;width:54px;height:54px;background:#25D366;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(37,211,102,0.35);text-decoration:none;z-index:99;font-size:24px;animation:waPulse 2.4s ease-out infinite}
    .wa-btn:hover{transform:scale(1.1)}
    @keyframes waPulse{0%{box-shadow:0 0 0 0 rgba(37,211,102,.45)}70%{box-shadow:0 0 0 14px rgba(37,211,102,0)}100%{box-shadow:0 0 0 0 rgba(37,211,102,0)}}

    /* FADE */
    .fade-in{opacity:0;transform:translateY(24px);transition:opacity .65s ease,transform .65s ease}
    .fade-in.visible{opacity:1;transform:translateY(0)}
    .fade-in:nth-child(1){transition-delay:.05s}
    .fade-in:nth-child(2){transition-delay:.15s}
    .fade-in:nth-child(3){transition-delay:.25s}
    .fade-in:nth-child(4){transition-delay:.35s}
    .fade-in:nth-child(5){transition-delay:.45s}
    .fade-in:nth-child(6){transition-delay:.55s}

    @media(max-width:900px){
      .hero-inner,.about-team-row,.contact-grid{grid-template-columns:1fr}
      .hero-visual{display:none}
      .services-grid,.portfolio-grid,.training-grid,.college-grid,.test-grid,.pricing-grid{grid-template-columns:1fr}
      .about-team-stats{grid-template-columns:repeat(2,1fr)}
      .ats-item:nth-child(2){border-right:none}
      .ats-item:nth-child(3){border-right:1px solid var(--border);border-top:1px solid var(--border)}
      .ats-item:nth-child(4){border-top:1px solid var(--border)}
      .about-audience{grid-template-columns:1fr}
      .why-grid{grid-template-columns:repeat(2,1fr)}
      .hero-h1{font-size:36px}
      .sec-title{font-size:30px}
      .nav-links,.nav-cta{display:none}
      .hamburger{display:flex}
    }
  `}</style>
);

/* ─────────────────────────────────────────────
   WHATSAPP ICON
───────────────────────────────────────────── */
const WhatsAppIcon = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12.004 2.003c-5.514 0-9.997 4.483-9.997 9.997 0 1.763.462 3.48 1.342 4.999l-1.41 5.146 5.279-1.385c1.48.816 3.184 1.238 4.816 1.238h.01c5.514 0 9.997-4.483 9.997-9.997s-4.483-9.997-9.997-9.997zm0 18.729c-1.581 0-3.114-.414-4.458-1.196l-.318-.188-3.133.822.837-3.049-.205-.318c-.87-1.355-1.334-2.94-1.334-4.56 0-4.373 3.557-7.93 7.93-7.93 4.373 0 7.93 3.557 7.93 7.93s-3.557 7.93-7.93 7.93z"/>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.1-.47-.149-.669.15-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.173.198-.298.298-.497.099-.198.05-.372-.025-.521-.074-.148-.669-1.611-.916-2.205-.242-.579-.486-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.693.626.71.227 1.356.195 1.87.118.571-.11 1.94-.719 2.22-1.413.27-.694.27-1.289.19-1.414-.08-.124-.26-.198-.57-.347z"/>
  </svg>
);

/* ─────────────────────────────────────────────
   NEW LOGO — Diamond-framed KM mark
───────────────────────────────────────────── */
const KMLogo = ({ size = 52 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lg-bg" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1A3C6E"/>
        <stop offset="100%" stopColor="#0C2548"/>
      </linearGradient>
      <linearGradient id="lg-k" x1="8" y1="14" x2="30" y2="46" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF"/>
        <stop offset="100%" stopColor="#B0C9F0"/>
      </linearGradient>
      <linearGradient id="lg-m" x1="28" y1="14" x2="52" y2="46" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F97316"/>
        <stop offset="100%" stopColor="#FBBF24"/>
      </linearGradient>
      <linearGradient id="lg-ring" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.6"/>
        <stop offset="50%" stopColor="#F97316" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.4"/>
      </linearGradient>
    </defs>
    {/* Outer ring — subtle glow */}
    <rect x="1" y="1" width="58" height="58" rx="15" stroke="url(#lg-ring)" strokeWidth="1" fill="none" opacity="0.6"/>
    {/* Main background */}
    <rect x="3" y="3" width="54" height="54" rx="13" fill="url(#lg-bg)"/>
    {/* Circuit corner accents */}
    <circle cx="9" cy="9" r="1.5" fill="#0EA5E9" opacity="0.5"/>
    <circle cx="51" cy="9" r="1.5" fill="#0EA5E9" opacity="0.5"/>
    <circle cx="9" cy="51" r="1.5" fill="#F97316" opacity="0.5"/>
    <circle cx="51" cy="51" r="1.5" fill="#F97316" opacity="0.5"/>
    <path d="M9 12v5M12 9h5M51 12v5M48 9h-5M9 48v-5M12 51h5" stroke="#0EA5E9" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
    <path d="M51 48v-5M48 51h-5" stroke="#F97316" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
    {/* Separator line */}
    <line x1="30" y1="16" x2="30" y2="44" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
    {/* K letter — bold geometric */}
    <path d="M11 15v30M11 29.5L20 15M11 29.5L21 45" stroke="url(#lg-k)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* M letter — bold geometric */}
    <path d="M27 45V15L35.5 30 44 15v30" stroke="url(#lg-m)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Accent dot */}
    <circle cx="50" cy="42" r="3" fill="#F97316"/>
    <circle cx="50" cy="42" r="5" fill="#F97316" opacity="0.2"/>
  </svg>
);

/* Logo for dark backgrounds (footer) */
const KMLogoFooter = ({ size = 52 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lfg-bg" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F97316"/>
        <stop offset="100%" stopColor="#EA6C0C"/>
      </linearGradient>
      <linearGradient id="lfg-m" x1="28" y1="14" x2="52" y2="46" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FBBF24"/>
        <stop offset="100%" stopColor="#FDE68A"/>
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="54" height="54" rx="13" fill="url(#lfg-bg)"/>
    <circle cx="9" cy="9" r="1.5" fill="rgba(255,255,255,0.4)"/>
    <circle cx="51" cy="9" r="1.5" fill="rgba(255,255,255,0.4)"/>
    <path d="M9 12v5M12 9h5M51 12v5M48 9h-5" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round"/>
    <line x1="30" y1="16" x2="30" y2="44" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
    <path d="M11 15v30M11 29.5L20 15M11 29.5L21 45" stroke="white" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M27 45V15L35.5 30 44 15v30" stroke="url(#lfg-m)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="50" cy="42" r="3" fill="white"/>
  </svg>
);

/* ─────────────────────────────────────────────
   PARTICLE CANVAS HOOK
───────────────────────────────────────────── */
function useParticleCanvas(canvasRef: RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = 0;
    let h = 0;
    let particles: Particle[] = [];
    let raf = 0;
    const COLORS = ["rgba(26,60,110,","rgba(14,165,233,","rgba(249,115,22,"];
    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    const mkP = () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 1,
      c: COLORS[Math.floor(Math.random() * 3)],
      a: Math.random() * .4 + .1,
      vx: (Math.random() - .5) * .35,
      vy: (Math.random() - .5) * .35,
    });
    const init = () => { particles = Array.from({ length: 50 }, mkP); };
    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c + p.a + ")";
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(26,60,110,${0.07 * (1 - d / 110)})`;
            ctx.lineWidth = .5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(loop);
    };
    const handleResize = () => {
      resize();
      init();
    };
    resize();
    init();
    loop();
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
    };
  }, [canvasRef]);
}

/* ─────────────────────────────────────────────
   SCROLL REVEAL HOOK
───────────────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if(e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
    }, { threshold: 0.08 });
    document.querySelectorAll(".fade-in").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ─────────────────────────────────────────────
   NAV
───────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const scrollToSection = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setOpen(false);
    document.querySelector(id)?.scrollIntoView({behavior:"smooth"});
  };

  return (
    <>
      <nav className={`nav${scrolled?" scrolled":""}`}>
        <div className="nav-inner">
          <a className="nav-logo" href="#hero" onClick={(e) => { e.preventDefault(); document.querySelector("#hero")?.scrollIntoView({behavior:"smooth"}); }}>
            <div className="logo-mark" style={{overflow:"hidden",borderRadius:32}}><img src={logoImage} alt="KM Technologies logo" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>
            <div className="logo-text-wrap">
              <span className="logo-name">KM Technologies</span>
              <span className="logo-tag">Build · Train · Deliver</span>
            </div>
          </a>
          <ul className="nav-links">
            {["#about","#services","#portfolio","#training","#pricing","#college","#contact"].map(id => (
              <li key={id}><a href={id} onClick={(e) => scrollToSection(e, id)}>{id.replace("#","").charAt(0).toUpperCase()+id.slice(2)}</a></li>
            ))}
          </ul>
          <a href="https://wa.me/919346819082?text=Hi, I visited KM Technologies website" target="_blank" className="nav-cta">WhatsApp Us</a>
          <button className="hamburger" onClick={() => setOpen(!open)}>
            <span/><span/><span/>
          </button>
        </div>
      </nav>
      <div className={`mobile-menu${open?" open":""}`}>
        {["#about","#services","#portfolio","#training","#pricing","#college","#contact"].map(id => (
          <a key={id} href={id} onClick={(e) => { scrollToSection(e, id); }}>{id.replace("#","").charAt(0).toUpperCase()+id.slice(2)}</a>
        ))}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */
function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useParticleCanvas(canvasRef);
  useEffect(() => {
    const t = setTimeout(() => {
      document.querySelectorAll<HTMLDivElement>(".mini-bar-fill").forEach(b => { if (b.dataset.w) b.style.width = b.dataset.w; });
    }, 800);
    return () => clearTimeout(t);
  }, []);
  return (
    <section id="hero" className="hero">
      <div className="hero-glow-a"/><div className="hero-glow-b"/>
      <canvas id="hero-canvas" ref={canvasRef}/>
      <div className="hero-inner">
        <div className="hero-content fade-in">
          <div className="hero-badge"><span className="pulse-dot"/>&nbsp;Hyderabad's trusted digital partner</div>
          <h1 className="hero-h1">Launch fast. Train confident.<br/>Grow with KM <em>Technologies.</em></h1>
          <p className="hero-sub">We design premium web apps, mobile apps and technical training that helps businesses scale and teams succeed. Clear delivery, strong support and polished digital experiences.</p>
          <div className="hero-btns">
            <a href="#contact" className="btn-primary" onClick={e=>{e.preventDefault();document.querySelector("#contact")?.scrollIntoView({behavior:"smooth"})}}>Start a Project ↗</a>
            <a href="https://wa.me/919346819082?text=Hi, I need help with a project" className="btn-wa" target="_blank"><WhatsAppIcon size={18}/> WhatsApp Now</a>
          </div>
          <div className="hero-stats">
            {[["10+","Years Combined Exp."],["15+","Developers & Testers"],["4+","Tech Stacks"],["500+","Students Trained"]].map(([n,l]) => (
              <div key={l}><div className="stat-num">{n}</div><div className="stat-label">{l}</div></div>
            ))}
          </div>
        </div>
        <div className="hero-visual fade-in">
          <div className="ft ft1"><div className="ft-dot" style={{background:"#22C55E"}}/> Project Live ✓</div>
          <div className="ft ft2"><div className="ft-dot" style={{background:"#F97316"}}/> Certificate Issued ✓</div>
          <div className="hero-card">
            <div className="hero-card-brand">
              <div style={{width:58,height:58,borderRadius:12,overflow:"hidden",flexShrink:0,boxShadow:"0 4px 14px rgba(0,0,0,0.12)"}}>
                <img src={founderImage} alt="Khasim Meeravali" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              </div>
              <div>
                <div className="hcb-name">KM Technologies</div>
                <div className="hcb-sub">Full Stack Dev &amp; Training · Hyderabad</div>
                <div className="hcb-badge">✓ Top Performer 2025</div>
              </div>
            </div>
            <div className="pills-wrap">
              {["Web Apps","Mobile Apps",".NET Training","Python","Java","Go"].map((p,i) => (
                <span key={p} className={`pill ${["pill-blue","pill-orange","pill-green","pill-purple","pill-blue","pill-orange"][i]}`}>{p}</span>
              ))}
            </div>
            <div style={{fontSize:11,color:"var(--muted)",marginBottom:8,fontWeight:500}}>Expertise level</div>
            {[["Web Development","95%"],["Mobile Development","88%"],["Training & Mentoring","92%"]].map(([l,w]) => (
              <div key={l}>
                <div style={{fontSize:11,color:"var(--muted)",marginBottom:3}}>{l}</div>
                <div className="mini-bar"><div className="mini-bar-fill" data-w={w}/></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   ABOUT — IMAGE-DRIVEN
───────────────────────────────────────────── */

// Curated Unsplash image URLs — all real professional photos
const IMGS = {
  founder:    founderImage,
  team:       "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",   // dev team at laptops
  business:   "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80",   // business meeting
  students:   "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80",   // students coding
  college:    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",   // college auditorium workshop
  dev1:       "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=200&q=80",   // developer headshot 1
  dev2:       "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=80",   // developer headshot 2
  dev3:       "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80",   // developer headshot 3
  testi1:     "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80",       // businessman
  testi2:     "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",   // female student
  testi3:     "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",   // startup founder
};

function About() {
  return (
    <section id="about">
      <div className="sec-inner">
        <div className="sec-head fade-in" style={{textAlign:"center",marginBottom:40}}>
          <div className="sec-label" style={{textAlign:"center"}}>About Us</div>
          <h2 className="sec-title" style={{maxWidth:640,margin:"0 auto 14px"}}>A team built from real enterprise experience</h2>
          <p className="sec-sub" style={{margin:"0 auto",textAlign:"center",maxWidth:580}}>Not a classroom project. Not a side hustle. KM Technologies is a team of seasoned developers, testers and trainers who have shipped production systems for real businesses across legal tech, agritech and enterprise HR.</p>
        </div>

        {/* Team stats row */}
        <div className="about-team-stats fade-in">
          {[
            ["10+","Years","Combined developer experience across the team"],
            ["15+","Experts","Full-stack developers, QA testers & cloud engineers"],
            ["5+","Trainers","Industry veterans who've built real enterprise systems"],
            ["500+","Students","Placed in top IT companies after our training programmes"],
          ].map(([num, unit, label]) => (
            <div key={unit} className="ats-item">
              <div className="ats-num">{num} <span className="ats-accent" style={{fontSize:22}}>{unit}</span></div>
              <div className="ats-label">{label}</div>
              <div className="ats-bar"/>
            </div>
          ))}
        </div>

        {/* Team photo strip */}
        <div className="fade-in" style={{marginBottom:52}}>
          <div style={{borderRadius:16,overflow:"hidden",position:"relative",height:220,boxShadow:"0 12px 40px rgba(0,0,0,0.1)"}}>
            <img src={IMGS.team} alt="KM Technologies development team" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 30%"}}/>
            <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,rgba(26,60,110,0.75) 0%,rgba(26,60,110,0.2) 60%,transparent 100%)"}}/>
            <div style={{position:"absolute",top:"50%",left:36,transform:"translateY(-50%)"}}>
              <div style={{color:"rgba(255,255,255,0.7)",fontSize:11,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:6}}>Our Team</div>
              <div style={{color:"#fff",fontSize:22,fontWeight:800,fontFamily:"'Fraunces',serif",lineHeight:1.2,marginBottom:10}}>Developers · Testers · Trainers</div>
              <div style={{display:"flex",gap:8}}>
                {[IMGS.dev1,IMGS.dev2,IMGS.dev3].map((src) => (
                  <img key={src} src={src} alt="Team member" style={{width:40,height:40,borderRadius:"50%",objectFit:"cover",border:"2px solid rgba(255,255,255,0.8)",marginLeft: src === IMGS.dev1 ? 0 : -10}}/>
                ))}
                <div style={{width:40,height:40,borderRadius:"50%",background:"var(--accent)",border:"2px solid rgba(255,255,255,0.8)",marginLeft:-10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff"}}>15+</div>
              </div>
            </div>
          </div>
        </div>

        {/* Audience cards — image-led */}
        <div className="about-audience fade-in">
          {/* Business card */}
          <div className="aa-card aa-biz">
            <div style={{height:140,borderRadius:10,overflow:"hidden",marginBottom:18,position:"relative"}}>
              <img src={IMGS.business} alt="Business meeting" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 40%,rgba(26,60,110,0.7) 100%)"}}/>
              <div style={{position:"absolute",bottom:10,left:12,color:"#fff",fontSize:13,fontWeight:700}}>For Businesses &amp; Startups</div>
            </div>
            <p style={{fontSize:13,color:"var(--muted)",lineHeight:1.75,marginBottom:14}}>You get a battle-tested team — not a solo freelancer. Our developers and testers have shipped enterprise-grade systems with proper QA, code reviews and Azure deployment.</p>
            <div className="aa-points">
              {["Dedicated developer + QA tester per project","Azure cloud deployment with CI/CD pipelines","Post-delivery support up to 3 months","NDA and IP protection on every engagement"].map(pt => (
                <div key={pt} className="aa-point">
                  <div className="aa-check" style={{background:"#EFF6FF",color:"#1D4ED8"}}>✓</div>
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Students card */}
          <div className="aa-card aa-stu">
            <div style={{height:140,borderRadius:10,overflow:"hidden",marginBottom:18,position:"relative"}}>
              <img src={IMGS.students} alt="Students learning to code" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 40%,rgba(194,65,12,0.7) 100%)"}}/>
              <div style={{position:"absolute",bottom:10,left:12,color:"#fff",fontSize:13,fontWeight:700}}>For Students &amp; Job Seekers</div>
            </div>
            <p style={{fontSize:13,color:"var(--muted)",lineHeight:1.75,marginBottom:14}}>Learn from developers active in production codebases — not outdated tutorials. Our trainers have 10+ years of real industry experience across .NET, Java, Python and Go.</p>
            <div className="aa-points">
              {["Trainers with 10+ years enterprise experience","Build real projects — not toy apps","Certificate issued on official letterhead","Placement mentorship until you land your first job"].map(pt => (
                <div key={pt} className="aa-point">
                  <div className="aa-check" style={{background:"#FFF7ED",color:"#C2410C"}}>✓</div>
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* College card */}
          <div className="aa-card aa-col">
            <div style={{height:140,borderRadius:10,overflow:"hidden",marginBottom:18,position:"relative"}}>
              <img src={IMGS.college} alt="College workshop" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 40%,rgba(109,40,217,0.7) 100%)"}}/>
              <div style={{position:"absolute",bottom:10,left:12,color:"#fff",fontSize:13,fontWeight:700}}>For Colleges &amp; Institutions</div>
            </div>
            <p style={{fontSize:13,color:"var(--muted)",lineHeight:1.75,marginBottom:14}}>Partner with a team that understands both academia and industry. We've mentored 500+ students and conducted workshops across engineering colleges in Hyderabad and Telangana.</p>
            <div className="aa-points">
              {["Workshops by industry practitioners, not lecturers","Live project deliverables during the session","College MOU partnerships with long-term programmes","Guest lectures, hackathons and internship support"].map(pt => (
                <div key={pt} className="aa-point">
                  <div className="aa-check" style={{background:"#F5F3FF",color:"#6D28D9"}}>✓</div>
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Founder row — real photo */}
        <div className="about-team-row fade-in">
          <div className="atr-visual">
            <div style={{borderRadius:24,overflow:"hidden",position:"relative",maxWidth:380,margin:"0 auto",boxShadow:"0 24px 64px rgba(26,60,110,0.18)"}}>
              <img src={IMGS.founder} alt="Khasim Meeravali — Founder, KM Technologies" style={{width:"100%",aspectRatio:"4/5",objectFit:"cover",display:"block"}}/>
              {/* Overlay cards */}
              <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 55%,rgba(10,22,40,0.85) 100%)"}}/>
              <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"24px 20px"}}>
                <div style={{color:"rgba(255,255,255,0.7)",fontSize:11,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4}}>Founder &amp; Lead Developer</div>
                <div style={{color:"#fff",fontSize:20,fontWeight:800,fontFamily:"'Fraunces',serif",marginBottom:10}}>Khasim Meeravali</div>
                <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"var(--accent)",color:"#fff",fontSize:11,fontWeight:700,padding:"5px 12px",borderRadius:10}}>🏆 Top Performer 2025</div>
              </div>
              {/* AZ-900 badge top right */}
              <div style={{position:"absolute",top:16,right:16,background:"rgba(255,255,255,0.95)",borderRadius:10,padding:"6px 10px",display:"flex",alignItems:"center",gap:6,boxShadow:"0 4px 14px rgba(0,0,0,0.15)"}}>
                <span style={{fontSize:16}}>☁️</span>
                <div>
                  <div style={{fontSize:9,fontWeight:700,color:"var(--primary)",letterSpacing:"0.06em",textTransform:"uppercase"}}>Microsoft</div>
                  <div style={{fontSize:10,fontWeight:600,color:"var(--muted)"}}>AZ-900 Certified</div>
                </div>
              </div>
            </div>
          </div>
          <div className="atr-content">
            <div className="sec-label">Meet the founder</div>
            <h3>Enterprise experience that gets you real results</h3>
            <p>KM Technologies is led by Khasim Meeravali — a Full Stack .NET Developer with hands-on enterprise experience building legal tech platforms, agri-commerce marketplaces and HR systems for real businesses. The team he has built brings the same depth.</p>
            <p>Unlike agencies that assign junior interns to your project, every client at KM Technologies gets direct access to senior developers and testers who have solved these problems before in production environments.</p>
            {["Recognized as Top Performer of the Year 2025","Microsoft Certified: Azure Fundamentals (AZ-900)","Automated 90% of client intake workflows in production","Led a team delivering enterprise-grade systems across 3+ domains","Active mentor to 15+ junior developers placed in IT companies"].map(pt => (
              <div key={pt} className="ah-item"><span className="ah-dot"/>{pt}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SERVICES
───────────────────────────────────────────── */
function Services() {
  const cards = [
    { cls:"sc-web", bg:"#EFF6FF", icon:"🌐", title:"Web Application Development", desc:"Powerful, scalable web applications for any business — from simple websites to complex enterprise platforms with full backend and cloud integration.", tags:["Business Websites","Web Apps","E-commerce","Portals","REST APIs","Azure Cloud"] },
    { cls:"sc-mob", bg:"#FFF7ED", icon:"📱", title:"Mobile Application Development", desc:"End-to-end mobile apps for Android and iOS — from customer-facing apps to internal business tools. We handle design, development and app store submission.", tags:["Android","iOS","React Native","Cross Platform","App Store"] },
    { cls:"sc-train", bg:"#F5F3FF", icon:"🎓", title:"Developer Training & Certificates", desc:"Hands-on, project-based full stack training in .NET, Python, Java and Go. Learn by building real applications and receive a professional certificate.", tags:[".NET Full Stack","Python","Java","Go","Certificate"] },
  ];
  return (
    <section id="services">
      <div className="sec-inner">
        <div className="sec-head fade-in">
          <div className="sec-label">What we do</div>
          <h2 className="sec-title">Everything your business needs — built end to end</h2>
          <p className="sec-sub">From a simple business website to a complex enterprise application — we handle it completely.</p>
        </div>
        <div className="services-grid">
          {cards.map(c => (
            <div key={c.title} className={`service-card ${c.cls} fade-in`}>
              <div className="svc-icon" style={{background:c.bg}}>{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
              <div className="stags">{c.tags.map(t => <span key={t} className="stag">{t}</span>)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PORTFOLIO
───────────────────────────────────────────── */
function Portfolio() {
  const projects = [
    { bg:"#EFF6FF", icon:"⚖️", badge:"Legal Tech", badgeBg:"#EFF6FF", badgeColor:"#1D4ED8", title:"COMS Legal Application", desc:"Comprehensive legal management system automating client intake, document generation, e-signature workflows and Azure cloud storage.", stack:["ASP.NET Core 8","React.js","Azure","SQL Server","CI/CD"], result:"↑ 90% intake automated — 40% faster document generation" },
    { bg:"#F0FDF4", icon:"👥", badge:"HR Tech", badgeBg:"#F0FDF4", badgeColor:"#166534", title:"Employee Management System", desc:"Enterprise HR platform for employee records, attendance, payroll processing with React dashboards and role-based access.", stack:["ASP.NET Core MVC","React.js","SQL Server","Azure"], result:"↑ 30% API performance improvement through query optimization" },
    { bg:"#FFF7ED", icon:"🌾", badge:"AgriTech", badgeBg:"#FFF7ED", badgeColor:"#C2410C", title:"AgriFarmer Marketplace", desc:"B2B agri-commerce platform connecting farmers to buyers, eliminating middlemen with quality verification and audit workflows.", stack:["ASP.NET Core API","Angular","Docker","JWT Auth"], result:"↑ Direct farmer-to-buyer transactions with full audit trail" },
  ];
  return (
    <section id="portfolio">
      <div className="sec-inner">
        <div className="sec-head fade-in">
          <div className="sec-label">Our Work</div>
          <h2 className="sec-title">Real projects. Real results.</h2>
          <p className="sec-sub">Every project solves a real business problem. Here are some of the applications we have delivered.</p>
        </div>
        <div className="portfolio-grid">
          {projects.map(p => (
            <div key={p.title} className="proj-card fade-in">
              <div className="proj-thumb" style={{background:p.bg}}>{p.icon}</div>
              <div className="proj-body">
                <span className="proj-badge" style={{background:p.badgeBg,color:p.badgeColor}}>{p.badge}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <div className="proj-stack">{p.stack.map(s => <span key={s} className="pstack">{s}</span>)}</div>
                <div className="proj-result">{p.result}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   TRAINING
───────────────────────────────────────────── */
function Training() {
  const courses = [
    { bg:"#EFF6FF", icon:"⚡", title:".NET Full Stack Development", dur:"2–3 Months", lvl:"Beginner to Job-ready", desc:"Master C#, ASP.NET Core, Entity Framework, SQL Server, React and Azure. Build enterprise-grade web applications from scratch.", tags:[["C# & .NET Core","pill-blue"],["ASP.NET Core API","pill-blue"],["React.js","pill-blue"],["SQL Server","pill-blue"],["Azure","pill-blue"],["Docker","pill-blue"]] },
    { bg:"#FFF7ED", icon:"🐍", title:"Python Full Stack Development", dur:"2–3 Months", lvl:"Beginner to Job-ready", desc:"Learn Python, Django/Flask, REST APIs, PostgreSQL and React. Build data-driven web applications and automation tools.", tags:[["Python","pill-orange"],["Django/Flask","pill-orange"],["REST APIs","pill-orange"],["PostgreSQL","pill-orange"],["React.js","pill-orange"]] },
    { bg:"#F0FDF4", icon:"☕", title:"Java Full Stack Development", dur:"2–3 Months", lvl:"Beginner to Job-ready", desc:"Master Core Java, Spring Boot, Hibernate, MySQL, Angular and microservices architecture. Most in-demand stack in India.", tags:[["Core Java","pill-green"],["Spring Boot","pill-green"],["Hibernate","pill-green"],["MySQL","pill-green"],["Angular","pill-green"]] },
    { bg:"#F5F3FF", icon:"🔵", title:"Go (Golang) Programming", dur:"1–2 Months", lvl:"Intermediate level", desc:"Learn Go from fundamentals to building high-performance REST APIs, microservices and cloud-native applications.", tags:[["Go Fundamentals","pill-purple"],["REST APIs","pill-purple"],["Microservices","pill-purple"],["gRPC","pill-purple"],["Docker","pill-purple"]] },
  ];
  return (
    <section id="training">
      <div className="sec-inner">
        <div className="sec-head fade-in">
          <div className="sec-label">For Students</div>
          <h2 className="sec-title">Learn any technology. Get certified.</h2>
          <p className="sec-sub">Hands-on, project-based training by industry veterans. By the end you'll have built a real application and a certificate to prove it.</p>
        </div>
        <div className="training-grid">
          {courses.map(c => (
            <div key={c.title} className="tr-card fade-in">
              <div className="tr-icon" style={{background:c.bg}}>{c.icon}</div>
              <div className="tr-body">
                <h3>{c.title}</h3>
                <div className="tr-meta"><span>⏱ {c.dur}</span><span>👨‍💻 {c.lvl}</span></div>
                <p>{c.desc}</p>
                <div className="tr-topics">{c.tags.map(([t,cls]) => <span key={t} className={`pill ${cls}`} style={{marginRight:4,marginBottom:4,display:"inline-block"}}>{t}</span>)}</div>
                <div className="cert-badge">✓ Certificate Included</div>
                <div className="pricing-note">Training plans designed for your team. Contact us for a custom proposal.</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PRICING
───────────────────────────────────────────── */
function Pricing() {
  const cards = [
    { icon:"🌐", name:"Business Website", quote:"Custom quote", feat:["5–10 page responsive website","Mobile friendly design","Contact form integration","WhatsApp button","1 month free support"], featured:false },
    { icon:"⚡", name:"Web Application", quote:"Custom quote", feat:["Full stack development","User authentication & roles","Admin dashboard","Azure cloud deployment","API integration","3 months free support"], featured:true },
    { icon:"📱", name:"Mobile Application", quote:"Custom quote", feat:["Android + iOS (React Native)","Backend API included","Push notifications","App store submission","3 months free support"], featured:false },
  ];
  return (
    <section id="pricing">
      <div className="sec-inner">
        <div className="sec-head fade-in">
          <div className="sec-label">Transparent Pricing</div>
          <h2 className="sec-title">Simple, honest pricing</h2>
          <p className="sec-sub">No hidden fees. No surprises. Get a custom quote after a free consultation call.</p>
        </div>
        <div className="pricing-grid">
          {cards.map(c => (
            <div key={c.name} className={`price-card fade-in${c.featured?" featured":""}`}>
              <div className="pc-icon">{c.icon}</div>
              <div className="pc-name">{c.name}</div>
              <div className="pc-price">{c.quote}</div>
              <ul className="pc-features">{c.feat.map(f => <li key={f}>{f}</li>)}</ul>
              <a href="#contact" className={`pc-btn ${c.featured?"pc-btn-primary":"pc-btn-outline"}`} onClick={e=>{e.preventDefault();document.querySelector("#contact")?.scrollIntoView({behavior:"smooth"})}}>Get Quote</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   COLLEGE
───────────────────────────────────────────── */
function College() {
  const items = [
    ["🏫","On-Campus Workshops","Full day hands-on workshops where students build real projects during the session itself under expert guidance."],
    ["🎤","Guest Lectures","Industry expert sessions on latest technologies, career guidance and real world software development practices."],
    ["💡","Hackathons","We organise and mentor college hackathons where students build solutions for real business problems."],
    ["📋","Internship Programmes","Students work on live projects at KM Technologies and receive a professional internship certificate."],
    ["🚀","Placement Preparation","Interview prep, resume building and mock technical interviews to help students crack their first IT job."],
    ["🤝","College Partnership (MOU)","Long-term partnership for regular training programmes and student development. Contact us for college pricing."],
  ];
  return (
    <section id="college">
      <div className="sec-inner">
        <div className="sec-head fade-in">
          <div className="sec-label">For Colleges &amp; Universities</div>
          <h2 className="sec-title">Workshops &amp; campus programmes</h2>
          <p className="sec-sub">We partner with colleges to run hands-on technical workshops, guest lectures and internship programmes that prepare students for real IT careers.</p>
        </div>
        <div className="college-grid">
          {items.map(([icon,title,desc]) => (
            <div key={title} className="col-card fade-in">
              <div className="col-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   TESTIMONIALS
───────────────────────────────────────────── */
function Testimonials() {
  const tcards = [
    { quote:"KM Technologies built our legal document management system exactly as we needed. Delivered on time and fully automated our client intake process. Highly recommended.", name:"Ramesh K.", role:"Legal Firm Owner, Hyderabad", photo:"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80" },
    { quote:"The .NET Full Stack training was hands-on and practical. I learned by building a real project and got placed in an IT company within 2 months of completing the course.", name:"Sai Priya", role:"Student, Now working as .NET Developer", photo:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" },
    { quote:"We got our farmer marketplace app built by KM Technologies. It works flawlessly and has helped us connect directly with buyers. Great communication throughout.", name:"Mohammed R.", role:"AgriTech Startup Founder", photo:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80" },
  ];
  return (
    <section id="testimonials">
      <div className="sec-inner">
        <div className="sec-head fade-in">
          <div className="sec-label">What people say</div>
          <h2 className="sec-title">Trusted by clients &amp; students</h2>
        </div>
        <div className="test-grid">
          {tcards.map(t => (
            <div key={t.name} className="tcard fade-in">
              <div className="tcard-stars">★★★★★</div>
              <p>"{t.quote}"</p>
              <div className="tcard-author">
                <img src={t.photo} alt={t.name} style={{width:42,height:42,borderRadius:"50%",objectFit:"cover",border:"2px solid var(--border)",flexShrink:0}}/>
                <div><div className="tcard-name">{t.name}</div><div className="tcard-role">{t.role}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   WHY
───────────────────────────────────────────── */
function Why() {
  return (
    <section id="why">
      <div className="why-logo-bg"><KMLogo size={440}/></div>
      <div className="sec-inner">
        <div className="sec-head fade-in">
          <div className="sec-label">Why KM Technologies</div>
          <h2 className="sec-title">Real experience. Real delivery.</h2>
          <p className="sec-sub">You work directly with a seasoned team — no middlemen, no delays, no surprises.</p>
        </div>
        <div className="why-grid">
          {[["10+","Years Experience","Combined developer experience across our team of developers, testers and cloud engineers"],["15+","Expert Team","Senior developers and QA testers who've shipped enterprise systems in production"],["500+","Students Trained","Placed in top IT companies through our hands-on training programmes"],["∞","Post-Delivery Support","We don't disappear after go-live. Ongoing support and maintenance included"]].map(([n,t,d]) => (
            <div key={t} className="why-card fade-in">
              <div className="wc-num">{n}</div>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FAQ
───────────────────────────────────────────── */
function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    ["How long does it take to build a web application?","A simple business website takes 5–7 days. A web application with backend and database typically takes 3–6 weeks depending on complexity. We give you a clear timeline estimate before starting."],
    ["Do you provide support after the project is delivered?","Yes — all projects include free post-delivery support. Business websites get 1 month, web applications and mobile apps get 3 months of free support and bug fixes."],
    ["What is included in the training certificate?","The KM Technologies training certificate includes your name, the technology you trained in, duration, and is issued on official letterhead. Valued by IT companies for its practical project-based experience."],
    ["Can you build both the web app and mobile app?","Absolutely. We build complete solutions — web application, mobile app (Android + iOS) and the backend API — all in one project. This is our most common engagement for businesses."],
    ["How do we start?","We begin with a short briefing, then share a clear project plan, timeline and custom quote. No sticker shock, just a practical path to launch."],
    ["Do you work with clients outside Hyderabad?","Yes — we work with clients across India and internationally. All communication and delivery happens online via WhatsApp, Google Meet and email. Location is never a barrier."],
  ];
  return (
    <section id="faq">
      <div className="sec-inner">
        <div className="sec-head fade-in">
          <div className="sec-label">FAQ</div>
          <h2 className="sec-title">Frequently asked questions</h2>
        </div>
        <div className="faq-list fade-in">
          {faqs.map(([q,a],i) => (
            <div key={q} className="faq-item">
              <button className="faq-q" onClick={() => setOpen(open===i?null:i)}>
                {q}<span className={`faq-icon${open===i?" open":""}`}>+</span>
              </button>
              {open===i && <div className="faq-a">{a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CONTACT
───────────────────────────────────────────── */
function Contact() {
  const [form, setForm] = useState({name:"",phone:"",email:"",type:"Business / Startup — need a web or mobile app",msg:""});
  const [sent, setSent] = useState(false);
  const submit = () => {
    if(!form.name||!form.phone){alert("Please fill in your name and phone number.");return;}
    const text = `Hi,%0A%0AName: ${form.name}%0APhone: ${form.phone}%0AEmail: ${form.email}%0AType: ${form.type}%0AMessage: ${form.msg}`;
    window.open(`https://wa.me/919346819082?text=${text}`,"_blank");
    setSent(true);
    setForm({name:"",phone:"",email:"",type:"Business / Startup — need a web or mobile app",msg:""});
  };
  return (
    <section id="contact">
      <div className="sec-inner">
        <div className="sec-head fade-in">
          <div className="sec-label">Get in touch</div>
          <h2 className="sec-title">Let's build something together</h2>
          <p className="sec-sub">Whether you need a web app, mobile app, training or a college workshop — reach out and we'll get back to you within 24 hours.</p>
        </div>
        <div className="contact-grid">
          <div className="fade-in">
            <h3 style={{fontSize:22,fontWeight:700,color:"var(--primary)",marginBottom:12}}>Talk to us directly</h3>
            <p style={{fontSize:14,color:"var(--muted)",lineHeight:1.8,marginBottom:26}}>Based in Hyderabad. Working with clients and students across India. Reach out anytime by WhatsApp or email for fast support and project guidance.</p>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {[["📞","Phone / WhatsApp","+91 9346819082"],["📧","Email","kmtechnologies.business@outlook.com"],["📍","Location","Hyderabad, Telangana — 500032"],["🔗","LinkedIn","Khasim Meeravali Dudekula"]].map(([icon,label,val]) => (
                <div key={label} style={{display:"flex",alignItems:"center",gap:13}}>
                  <div className="ci-icon">{icon}</div>
                  <div><div className="ci-label">{label}</div><div className="ci-value">{val}</div></div>
                </div>
              ))}
            </div>
            <div style={{marginTop:24}}>
              <a href="https://wa.me/919346819082?text=Hi, I need help with a project" target="_blank" className="btn-wa"><WhatsAppIcon size={18}/> Chat on WhatsApp</a>
            </div>
          </div>
          <div className="fade-in">
            <div className="contact-form">
              <div className="form-row">
                <div className="form-group"><label htmlFor="contact-name">Your Name</label><input id="contact-name" type="text" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Enter your name"/></div>
                <div className="form-group"><label htmlFor="contact-phone">Phone / WhatsApp</label><input id="contact-phone" type="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Your number"/></div>
              </div>
              <div className="form-group"><label htmlFor="contact-email">Email</label><input id="contact-email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="your@email.com"/></div>
              <div className="form-group">
                <label htmlFor="contact-type">I am a</label>
                <select id="contact-type" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                  <option>Business / Startup — need a web or mobile app</option>
                  <option>Student — looking for training</option>
                  <option>College — looking for workshops</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group"><label htmlFor="contact-msg">Tell us what you need</label><textarea id="contact-msg" value={form.msg} onChange={e=>setForm({...form,msg:e.target.value})} placeholder="Describe your requirement briefly..."/></div>
              <button className="form-submit" onClick={submit}>Send Message ↗</button>
              {sent && <div className="form-success">✓ Thank you! We will contact you within 24 hours.</div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="fb-logo">
              <div className="fb-logo-box"><KMLogoFooter size={52}/></div>
              <div>
                <div className="fb-name">KM Technologies</div>
                <div className="fb-tagline">Build · Train · Deliver</div>
              </div>
            </div>
            <p>Building web apps, mobile apps and training developers in Hyderabad, India.</p>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <a href="#services">Web Development</a>
            <a href="#services">Mobile Apps</a>
            <a href="#training">Training</a>
            <a href="#college">College Workshops</a>
          </div>
          <div className="footer-col">
            <h4>Training</h4>
            <a href="#training">.NET Full Stack</a>
            <a href="#training">Python Full Stack</a>
            <a href="#training">Java Full Stack</a>
            <a href="#training">Go Programming</a>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <a href="tel:+919346819082">+91 9346819082</a>
            <a href="mailto:kmtechnologies.business@outlook.com">kmtechnologies.business@outlook.com</a>
            <span>Hyderabad, Telangana</span>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© 2026 KM Technologies, Hyderabad. All rights reserved.</div>
          <div className="footer-bottom-links"><span>Privacy Policy</span><span>Terms of Service</span></div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   APP
───────────────────────────────────────────── */
export default function App() {
  useScrollReveal();
  return (
    <>
      <GlobalStyles/>
      <Nav/>
      <Hero/>
      <About/>
      <Services/>
      <Portfolio/>
      <Training/>
      <Pricing/>
      <College/>
      <Testimonials/>
      <Why/>
      <Faq/>
      <Contact/>
      <Footer/>
      <a href="https://wa.me/919346819082?text=Hi, I visited KM Technologies website!" className="wa-btn" target="_blank" title="Chat on WhatsApp"><WhatsAppIcon size={24}/></a>
    </>
  );
}