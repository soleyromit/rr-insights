/**
 * EXXATLY NEW DS — Clean Tailwind Config
 * Use this to OVERWRITE any AI-generated tailwind.config.js
 * that contains var(--...) references.
 *
 * WHY: Magic Patterns AI reads index.css and mirrors CSS variable
 * names as Tailwind color keys using var(--...) references.
 * This causes "Trimmed messages exceeds token context limit".
 * Solution: always overwrite with this clean hex-only version.
 *
 * Usage in Magic Patterns (write_artifact_files):
 *   fileName: "tailwind.config.js"
 *   content: <this file>
 */

/** @type {import('tailwindcss').Config} */
// ⚠️ HEX VALUES ONLY — never var(--...) in this file
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
        bg:'#0b0b0e', card:'#15161a', secondary:'#222137', accent:'#272445', 'deep-panel':'#0e111b',
        sidebar:{DEFAULT:'#1a1a21',active:'#28282f',border:'#424248'},
        brand:{DEFAULT:'#5f53ae',dark:'#3f3679',deep:'#272050',light:'#b2afef',tint:'#f3f3ff',subtle:'#e8e8f9'},
        fg:{DEFAULT:'#fafafa',muted:'#a1a4ac',subtle:'#817b7c'},
        border:{DEFAULT:'#414247',control:'#a1a4ac',sidebar:'#424248'},
        'btn-primary':'#fafafa','btn-primary-fg':'#39393c',
        destructive:'#f14d4c',success:'#33cb91',warning:'#efad00',info:'#2b7fff',
        'trend-up':'#33cb91','trend-down':'#f14d4c',
        'status-review':'#7aadff','status-pending':'#f4bb2b','status-completed':'#d4d0d0',
        'status-rejected':'#f14d4c','status-confirmed':'#60d2a1',
        'status-overdue':'#f14d4c','status-due-soon':'#fef3c6',
        'badge-new':'#5f53ae','badge-beta':'#fdc700','badge-notif':'#e7000b',
        'avatar-bg':'#4e4a7e','avatar-fg':'#fbfbff',
        'chart-1':'#2b7fff','chart-2':'#33cb91','chart-3':'#efad00','chart-4':'#f14d4c','chart-5':'#b2afef',
        'tab-bar':'#222137','tab-active':'#0b0b0e','tab-active-fg':'#fafafa','tab-inactive-fg':'#a1a4ac',
      },
      borderRadius: {
        xs:'2px', sm:'4px', DEFAULT:'8px', md:'8px', lg:'12px', xl:'16px', pill:'9999px',
      },
      boxShadow: {
        sm:'0px 1px 2px rgba(0,0,0,0.4)', DEFAULT:'0px 2px 8px rgba(0,0,0,0.5)',
        md:'0px 2px 8px rgba(0,0,0,0.5)', lg:'0px 4px 16px rgba(0,0,0,0.6)',
      },
      height: {
        control:'40px','control-sm':'32px','control-touch':'44px',
        header:'48px','table-row':'48px','dropdown-item':'28px',
        'sidebar-icon':'36px',tab:'24px',checkbox:'16px',
      },
      width: {
        sidebar:'240px','sidebar-collapsed':'60px',panel:'382px',checkbox:'16px',
      },
      zIndex:{dropdown:'50',sticky:'60',modal:'100',toast:'200'},
      spacing:{
        '1':'4px','2':'8px','3':'12px','4':'16px','5':'20px',
        '6':'24px','8':'32px','10':'40px','12':'48px','16':'64px',
      },
    },
  },
  plugins:[],
};
