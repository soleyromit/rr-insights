/**
 * EXXATLY DS — Clean Tailwind Config v2
 * ⚠️  HEX ONLY — zero var() references (prevents token context overflow)
 * Updated: March 27, 2026 — chart colors corrected, light mode tokens added
 *
 * USE: After every AI generation, write_artifact_files this as tailwind.config.js
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter','ui-sans-serif','system-ui','sans-serif'],
        ui:   ['Inter','ui-sans-serif','system-ui','sans-serif'],
        mono: ['ui-monospace','SFMono-Regular','Menlo','Monaco','monospace'],
      },
      fontSize: {
        xs:    ['11px',{lineHeight:'1.5',letterSpacing:'0.025em'}],
        sm:    ['12px',{lineHeight:'1.5'}],
        base:  ['14px',{lineHeight:'1.5'}],
        lg:    ['16px',{lineHeight:'1.5'}],
        xl:    ['18px',{lineHeight:'1.4'}],
        '2xl': ['24px',{lineHeight:'1.3'}],
        stat:  ['36px',{lineHeight:'1',fontWeight:'700'}],
      },
      colors: {
        /* DARK MODE SURFACES */
        bg:'#0b0b0e', card:'#15161a', secondary:'#222137', accent:'#272445',
        'deep-panel':'#0e111b',
        sidebar:{ DEFAULT:'#1a1a21', active:'#28282f', border:'#424248' },
        /* LIGHT MODE SURFACES */
        'light-bg':'#ffffff', 'light-page':'#f3f3ff',
        'light-card':'#ffffff', 'light-secondary':'#ededf6',
        'light-muted':'#ececf2',
        'light-sidebar':'#3f3679', 'light-sidebar-active':'#ebebfd',
        'light-border':'#e4e4e6',
        /* BRAND */
        brand:{ DEFAULT:'#5f53ae', dark:'#3f3679', deep:'#272050',
                light:'#b2afef', tint:'#f3f3ff', subtle:'#e8e8f9' },
        /* TEXT */
        fg:{ DEFAULT:'#fafafa', muted:'#a1a4ac', subtle:'#817b7c' },
        'light-fg':'#0a0a0a', 'light-fg-muted':'#60636a',
        /* BORDERS */
        border:{ DEFAULT:'#414247', control:'#a1a4ac', sidebar:'#424248' },
        /* BUTTONS (dark=inverted white, light=dark on light) */
        'btn-primary':'#fafafa', 'btn-primary-fg':'#39393c',
        /* SEMANTIC */
        destructive:'#f14d4c', success:'#33cb91', warning:'#efad00', info:'#2b7fff',
        'trend-up':'#33cb91', 'trend-down':'#f14d4c',
        /* STATUS BADGES */
        'status-review':'#7aadff','status-pending':'#f4bb2b',
        'status-completed':'#d4d0d0','status-rejected':'#f14d4c',
        'status-confirmed':'#60d2a1','status-overdue':'#f14d4c',
        'status-due-soon':'#fef3c6',
        /* NAV BADGES */
        'badge-new':'#5f53ae','badge-beta':'#fdc700','badge-notif':'#e7000b',
        /* FILTER TABS */
        'tab-bar':'#222137','tab-active':'#0b0b0e',
        'tab-active-fg':'#fafafa','tab-inactive-fg':'#a1a4ac',
        /* AVATAR */
        'avatar-bg':'#4e4a7e','avatar-fg':'#fbfbff',
        /* CHARTS — confirmed from recharts live renders */
        'chart-1':'#5794ff', 'chart-2':'#33cb91',
        'chart-3':'#54c6f3', 'chart-4':'#f3b100', 'chart-5':'#f49500',
      },
      borderRadius:{
        xs:'2px', sm:'4px', DEFAULT:'8px', md:'8px',
        lg:'12px', xl:'16px', pill:'9999px',
      },
      boxShadow:{
        sm:'0px 1px 2px rgba(0,0,0,0.4)',
        DEFAULT:'0px 2px 8px rgba(0,0,0,0.5)',
        md:'0px 2px 8px rgba(0,0,0,0.5)',
        lg:'0px 4px 16px rgba(0,0,0,0.6)',
        light:'0px 1px 4px rgba(0,0,0,0.08),0px 4px 16px rgba(0,0,0,0.06)',
      },
      height:{
        control:'40px','control-sm':'32px','control-touch':'44px',
        header:'48px','table-row':'48px','dropdown-item':'28px',
        'sidebar-icon':'36px', tab:'24px', checkbox:'16px',
      },
      width:{
        sidebar:'240px','sidebar-collapsed':'60px',
        panel:'382px', checkbox:'16px',
      },
      zIndex:{ dropdown:'50', sticky:'60', modal:'100', toast:'200' },
      spacing:{
        '1':'4px','2':'8px','3':'12px','4':'16px','5':'20px',
        '6':'24px','8':'32px','10':'40px','12':'48px','16':'64px',
      },
    },
  },
  plugins:[],
};
