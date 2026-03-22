import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as d3 from 'd3';
import { 
  BookOpen, 
  Layers, 
  Search, 
  Filter, 
  ChevronRight, 
  ExternalLink, 
  FileText, 
  BarChart3, 
  Network,
  Lock,
  Globe,
  Info,
  Menu,
  X,
  ArrowRight,
  Database,
  Award,
  BookMarked,
  LayoutDashboard,
  PieChart,
  TrendingUp,
  Map as MapIcon,
  MessageSquare,
  User,
  Upload,
  Download,
  Activity,
  Cpu,
  Zap,
  ShieldCheck,
  Mail
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
  Legend,
  Line,
  ComposedChart
} from 'recharts';
import AIChatbot from './components/AIChatbot';

// --- Types ---

interface Paper {
  id: string;
  title: string;
  author: string;
  year: number;
  journal: string;
  tags: string[];
  abstract: string;
  doi?: string;
  category: string;
}

interface Chapter {
  id: string;
  title: { vi: string; en: string };
  description: { vi: string; en: string };
  color: string;
  icon: React.ReactNode;
}

interface CSVData {
  doi: number;
  fp: number;
  regime: string;
  fdci?: number;
}

// --- Constants & Data ---

const DISSERTATION_TITLE = "Quốc tế hóa và hiệu quả hoạt động kinh doanh của các doanh nghiệp ở Châu Á";

const CHAPTERS: Chapter[] = [
  {
    id: 'intro',
    title: { en: 'Chapter 1: Introduction', vi: 'Chương 1: Giới thiệu' },
    description: { 
      en: 'Overview of the research context, objectives, and scope of the dissertation.',
      vi: 'Tổng quan về bối cảnh nghiên cứu, mục tiêu và phạm vi của luận án.'
    },
    color: 'indigo',
    icon: <Info className="w-5 h-5" />
  },
  {
    id: 'framework',
    title: { en: 'Theoretical Framework', vi: 'Khung lý thuyết' },
    description: { 
      en: 'The Institutionally-Contingent Resource View (ICRV) as a mid-range integrative framework.',
      vi: 'Quan điểm Nguồn lực Phụ thuộc vào Thể chế (ICRV) như một khung tích hợp tầm trung.'
    },
    color: 'purple',
    icon: <Layers className="w-5 h-5" />
  },
  {
    id: 'lit-review',
    title: { en: 'Chapter 2: Literature Review', vi: 'Chương 2: Tổng quan lý thuyết' },
    description: { 
      en: 'Analysis of previous studies on internationalization and business performance.',
      vi: 'Phân tích các nghiên cứu trước đây về quốc tế hóa và hiệu quả kinh doanh.'
    },
    color: 'blue',
    icon: <BookOpen className="w-5 h-5" />
  },
  {
    id: 'methodology',
    title: { en: 'Chapter 3: Methodology', vi: 'Chương 3: Phương pháp nghiên cứu' },
    description: { 
      en: 'Description of the research model, hypotheses, and data analysis methods using WBES data.',
      vi: 'Mô tả mô hình nghiên cứu, giả thuyết và phương pháp phân tích dữ liệu sử dụng dữ liệu WBES.'
    },
    color: 'emerald',
    icon: <Database className="w-5 h-5" />
  },
  {
    id: 'results',
    title: { en: 'Chapter 4: Results & Discussion', vi: 'Chương 4: Kết quả & Thảo luận' },
    description: { 
      en: 'Empirical findings from WBES data and discussion of the DOI-FP relationship across regimes.',
      vi: 'Kết quả thực nghiệm từ dữ liệu WBES và thảo luận về mối quan hệ DOI-FP qua các chế độ.'
    },
    color: 'amber',
    icon: <TrendingUp className="w-5 h-5" />
  },
  {
    id: 'agenda',
    title: { en: 'Research Agenda', vi: 'Chương trình nghiên cứu' },
    description: { 
      en: 'Future research streams and the publication pipeline.',
      vi: 'Các hướng nghiên cứu tương lai và lộ trình công bố.'
    },
    color: 'cyan',
    icon: <Network className="w-5 h-5" />
  },
  {
    id: 'conclusion',
    title: { en: 'Chapter 5: Conclusion & Recommendations', vi: 'Chương 5: Kết luận & Kiến nghị' },
    description: { 
      en: 'Summary of contributions and practical recommendations for managers and policymakers.',
      vi: 'Tóm tắt đóng góp và đề xuất thực tiễn cho các nhà quản lý và hoạch định chính sách.'
    },
    color: 'rose',
    icon: <Award className="w-5 h-5" />
  }
];

const SAMPLE_PAPERS: Paper[] = [
  {
    id: '1',
    title: 'Internationalization and Firm Performance: A Meta-Analysis',
    author: 'Kirca et al.',
    year: 2011,
    journal: 'Journal of Management',
    tags: ['Meta-analysis', 'Performance', 'Internationalization'],
    abstract: 'This study provides a comprehensive meta-analysis of the relationship between internationalization and firm performance.',
    category: 'lit-review'
  },
  {
    id: '2',
    title: 'The Impact of Institutional Quality on Internationalization',
    author: 'Peng et al.',
    year: 2008,
    journal: 'Academy of Management Review',
    tags: ['Institutions', 'Strategy', 'Emerging Markets'],
    abstract: 'Explores how institutional environments in emerging economies influence firm strategy and international expansion.',
    category: 'lit-review'
  },
  {
    id: '3',
    title: 'Business Performance in Asian SMEs: The Role of Digitalization',
    author: 'Nguyen & Do',
    year: 2023,
    journal: 'Asian Business Review',
    tags: ['SMEs', 'Digitalization', 'Asia'],
    abstract: 'Investigates how digital transformation affects the performance of small and medium enterprises in Southeast Asia.',
    category: 'results'
  },
  {
    id: '4',
    title: 'Corporate Governance and Internationalization in Vietnam',
    author: 'Tran et al.',
    year: 2022,
    journal: 'Journal of Asian Economics',
    tags: ['Governance', 'Vietnam', 'Internationalization'],
    abstract: 'Analyzes the link between board characteristics and the degree of internationalization in Vietnamese listed firms.',
    category: 'results'
  },
  {
    id: '5',
    title: 'Dynamic Capabilities and Export Performance',
    author: 'Wang & Ahmed',
    year: 2022,
    journal: 'British Journal of Management',
    tags: ['Capabilities', 'Export', 'Performance'],
    abstract: 'Develops a framework for understanding how dynamic capabilities drive export success in competitive markets.',
    category: 'lit-review'
  },
  {
    id: '6',
    title: 'Foreign Direct Investment and Economic Growth in Asia',
    author: 'Lee & Chang',
    year: 2021,
    journal: 'World Development',
    tags: ['FDI', 'Growth', 'Asia'],
    abstract: 'Examines the long-term impact of FDI inflows on the economic development of Asian countries.',
    category: 'intro'
  },
  {
    id: '7',
    title: 'Innovation Systems in Emerging Economies',
    author: 'Lundvall et al.',
    year: 2021,
    journal: 'Research Policy',
    tags: ['Innovation', 'Emerging Markets', 'Policy'],
    abstract: 'Discusses the unique challenges of building innovation systems in developing nations.',
    category: 'lit-review'
  },
  {
    id: '8',
    title: 'Supply Chain Resilience in the Post-Pandemic Era',
    author: 'Smith & Jones',
    year: 2023,
    journal: 'International Journal of Logistics',
    tags: ['Supply Chain', 'Resilience', 'Pandemic'],
    abstract: 'Proposes strategies for enhancing supply chain robustness in response to global disruptions.',
    category: 'discussion'
  }
];

const RADAR_DATA = [
  { subject: 'Strategy', A: 120, B: 110, fullMark: 150 },
  { subject: 'Finance', A: 98, B: 130, fullMark: 150 },
  { subject: 'Market', A: 86, B: 130, fullMark: 150 },
  { subject: 'Innovation', A: 99, B: 100, fullMark: 150 },
  { subject: 'Risk', A: 85, B: 90, fullMark: 150 },
  { subject: 'Growth', A: 65, B: 85, fullMark: 150 },
];

// --- Sub-components ---

const RegimeChart: React.FC<{ regime: string; lang: 'en' | 'vi' }> = ({ regime, lang }) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; doi: number; fp: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const getPath = () => {
    switch (regime) {
      case 'I': return "M 20 180 Q 150 20 280 180"; // Steep Inverted-U
      case 'II': return "M 20 150 Q 150 80 280 150"; // Flatter
      case 'III': return "M 20 100 Q 150 120 280 180"; // Downward/Paradox
      default: return "M 20 180 Q 150 20 280 180";
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursor = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    
    // Simple mapping for demo purposes
    const doi = Math.round(((cursor.x - 20) / 260) * 100);
    const fp = Math.round((180 - cursor.y) / 1.6);
    
    if (doi >= 0 && doi <= 100 && cursor.y >= 20 && cursor.y <= 180) {
      setHoveredPoint({ x: cursor.x, y: cursor.y, doi, fp });
    } else {
      setHoveredPoint(null);
    }
  };

  return (
    <div className="relative w-full h-[300px] bg-slate-900 rounded-xl p-6 border border-white/5 overflow-hidden group">
      <div className="absolute top-4 left-6">
        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
          {lang === 'en' ? 'Theoretical Relationship' : 'Mối quan hệ lý thuyết'}
        </span>
      </div>
      <svg 
        ref={svgRef}
        viewBox="0 0 300 200" 
        className="w-full h-full cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredPoint(null)}
      >
        {/* Grid Lines */}
        {[40, 80, 120, 160].map(y => (
          <line key={y} x1="20" y1={y} x2="280" y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
        ))}
        {[85, 150, 215].map(x => (
          <line key={x} x1={x} y1="20" x2={x} y2="180" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
        ))}

        {/* Axes */}
        <line x1="20" y1="180" x2="280" y2="180" stroke="#475569" strokeWidth="1.5" />
        <line x1="20" y1="180" x2="20" y2="20" stroke="#475569" strokeWidth="1.5" />
        
        {/* Labels */}
        <text x="280" y="195" textAnchor="end" fill="#94a3b8" fontSize="10" fontWeight="bold">DOI (%)</text>
        <text x="15" y="25" textAnchor="start" fill="#94a3b8" fontSize="10" fontWeight="bold" transform="rotate(-90, 15, 25)">FP (Performance)</text>

        {/* Curve */}
        <motion.path
          d={getPath()}
          fill="none"
          stroke="#6366f1"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Turning Point Indicator */}
        {regime !== 'III' && (
          <motion.circle
            cx="150"
            cy={regime === 'I' ? 45 : 95}
            r="4"
            fill="#fbbf24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          />
        )}

        {/* Tooltip Dot */}
        {hoveredPoint && (
          <circle cx={hoveredPoint.x} cy={hoveredPoint.y} r="3" fill="#fff" />
        )}
      </svg>

      {/* Tooltip Overlay */}
      <AnimatePresence>
        {hoveredPoint && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute z-50 pointer-events-none bg-slate-950/90 border border-white/10 p-2 rounded-lg shadow-2xl"
            style={{ left: hoveredPoint.x + 20, top: hoveredPoint.y - 40 }}
          >
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">
              DOI: {hoveredPoint.doi}%
            </p>
            <p className="text-[10px] font-bold text-white uppercase tracking-tighter">
              FP: {hoveredPoint.fp}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-4 right-6 text-right">
        <p className="text-xs font-medium text-slate-400">
          {regime === 'I' && (lang === 'en' ? 'Regime I: Amplification' : 'Chế độ I: Khuếch đại')}
          {regime === 'II' && (lang === 'en' ? 'Regime II: Weak Paradox' : 'Chế độ II: Nghịch lý yếu')}
          {regime === 'III' && (lang === 'en' ? 'Regime III: Digital Paradox' : 'Chế độ III: Nghịch lý số')}
        </p>
      </div>
    </div>
  );
};

const Dashboard: React.FC<{ lang: 'en' | 'vi' }> = ({ lang }) => {
  const [data, setData] = useState<CSVData[]>([]);
  const [fdciEnabled, setFdciEnabled] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = d3.csvParse(text, (d) => ({
        doi: +d.doi!,
        fp: +d.fp!,
        regime: d.regime!,
        fdci: d.fdci ? +d.fdci : undefined
      })) as CSVData[];
      setData(parsed);
    };
    reader.readAsText(file);
  };

  const regressionLine = useMemo(() => {
    if (data.length < 2) return [];
    const xMean = d3.mean(data, d => d.doi) || 0;
    const yMean = d3.mean(data, d => d.fp) || 0;
    
    let num = 0;
    let den = 0;
    data.forEach(d => {
      num += (d.doi - xMean) * (d.fp - yMean);
      den += (d.doi - xMean) ** 2;
    });
    
    const slope = num / den;
    const intercept = yMean - slope * xMean;
    
    const minX = d3.min(data, d => d.doi) || 0;
    const maxX = d3.max(data, d => d.doi) || 100;
    
    return [
      { doi: minX, fp: slope * minX + intercept },
      { doi: maxX, fp: slope * maxX + intercept }
    ];
  }, [data]);

  return (
    <div className="academic-card p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-xl font-serif font-bold text-white mb-1">
            {lang === 'en' ? 'Real Data Dashboard' : 'Bảng điều khiển dữ liệu thực'}
          </h3>
          <p className="text-sm text-slate-400">
            {lang === 'en' ? 'Upload WBES CSV data to visualize DOI-FP relationship.' : 'Tải lên dữ liệu WBES CSV để trực quan hóa mối quan hệ DOI-FP.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileUpload} 
            ref={fileInputRef}
            className="hidden"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg transition-colors"
          >
            <Upload className="w-4 h-4" />
            {lang === 'en' ? 'Upload CSV' : 'Tải lên CSV'}
          </button>
          <button 
            onClick={() => setFdciEnabled(!fdciEnabled)}
            className={`flex items-center gap-2 px-4 py-2 border ${fdciEnabled ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' : 'border-slate-700 text-slate-400'} text-sm font-bold rounded-lg transition-all`}
          >
            <Cpu className="w-4 h-4" />
            {lang === 'en' ? 'FDCI Effect' : 'Hiệu ứng FDCI'}
          </button>
        </div>
      </div>

      <div className="h-[400px] w-full">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <XAxis 
                dataKey="doi" 
                name="DOI" 
                unit="%" 
                type="number" 
                domain={[0, 'auto']}
                stroke="#475569"
                fontSize={12}
              />
              <YAxis 
                dataKey="fp" 
                name="FP" 
                type="number" 
                domain={['auto', 'auto']}
                stroke="#475569"
                fontSize={12}
              />
              <ZAxis range={[60, 400]} />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px' }}
              />
              <Legend />
              <Scatter 
                name="Firms" 
                data={data} 
                fill="#6366f1"
                opacity={fdciEnabled ? 0.4 : 0.8}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.regime === 'I' ? '#6366f1' : entry.regime === 'II' ? '#fbbf24' : '#ef4444'} 
                  />
                ))}
              </Scatter>
              <Line 
                type="monotone" 
                data={regressionLine} 
                dataKey="fp" 
                stroke="#10b981" 
                strokeWidth={2} 
                dot={false} 
                name="OLS Regression"
              />
              {fdciEnabled && (
                <Line 
                  type="monotone" 
                  data={data.map(d => ({ ...d, fp: d.fp * 1.15 }))} 
                  dataKey="fp" 
                  stroke="#fbbf24" 
                  strokeDasharray="5 5" 
                  dot={false} 
                  name="FDCI Moderation (Simulated)"
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/50">
            <Database className="w-12 h-12 text-slate-700 mb-4" />
            <p className="text-slate-500 font-medium">
              {lang === 'en' ? 'No data loaded. Please upload a CSV file.' : 'Chưa có dữ liệu. Vui lòng tải lên tệp CSV.'}
            </p>
            <p className="text-[10px] text-slate-600 mt-2 uppercase tracking-widest">
              {lang === 'en' ? 'Required columns: doi, fp, regime' : 'Cột bắt buộc: doi, fp, regime'}
            </p>
          </div>
        )}
      </div>
      <div className="mt-4 flex justify-center">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          {lang === 'en' ? 'Empirical Visualization' : 'Trực quan hóa thực nghiệm'}
        </span>
      </div>
    </div>
  );
};

const ContentSection: React.FC<{ 
  title: { en: string; vi: string }; 
  children: React.ReactNode;
  icon: React.ReactNode;
  lang: 'en' | 'vi';
}> = ({ title, children, icon, lang }) => (
  <section className="mb-16">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
        {icon}
      </div>
      <h2 className="text-2xl font-serif font-bold text-white">
        {title.en} <span className="text-slate-500 font-normal text-lg ml-2">/ {title.vi}</span>
      </h2>
    </div>
    <div className="academic-card p-8">
      {children}
    </div>
  </section>
);

// --- Components ---

const PasswordScreen: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = (import.meta as any).env.VITE_APP_PASSWORD || 'admin123';
    if (password === correctPassword) {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md academic-card p-8 text-center"
      >
        <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
          <Lock className="w-8 h-8 text-indigo-500" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-2 italic">
          Dissertation Access
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
          Please enter the access code to view the dissertation map and evidence database.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter access code..."
              className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border ${error ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-center font-mono`}
            />
            <AnimatePresence>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-rose-500 text-xs mt-2 font-medium"
                >
                  Incorrect access code. Please try again.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <button 
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]"
          >
            Unlock Dissertation
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const App: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [lang, setLang] = useState<'vi' | 'en'>('en');
  const [activeChapter, setActiveChapter] = useState<string>('intro');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [activeRegime, setActiveRegime] = useState<string>('I');

  useEffect(() => {
    const saved = sessionStorage.getItem('dissertation_unlocked');
    if (saved === 'true') setIsUnlocked(true);
  }, []);

  const handleUnlock = () => {
    setIsUnlocked(true);
    sessionStorage.setItem('dissertation_unlocked', 'true');
  };

  const filteredPapers = useMemo(() => {
    return SAMPLE_PAPERS.filter(p => 
      (p.category === activeChapter || activeChapter === 'all') &&
      (p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
       p.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
       p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
    );
  }, [activeChapter, searchQuery]);

  const barChartData = useMemo(() => {
    const years = [...new Set(SAMPLE_PAPERS.map(p => p.year))].sort();
    return years.map(year => ({
      name: year.toString(),
      count: SAMPLE_PAPERS.filter(p => p.year === year).length
    }));
  }, []);

  if (!isUnlocked) {
    return <PasswordScreen onUnlock={handleUnlock} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0A] flex text-slate-900 dark:text-slate-100">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="fixed lg:relative z-40 w-[280px] h-screen bg-white dark:bg-[#0F172A] border-r border-slate-200 dark:border-white/5 flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <BookMarked className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-serif font-bold italic leading-tight">Evidence Map</h1>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Dissertation v1.0</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
              <div className="px-3 mb-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chapters</p>
              </div>
              {CHAPTERS.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() => setActiveChapter(chapter.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                    activeChapter === chapter.id 
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' 
                      : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <div className={`p-2 rounded-lg transition-colors ${
                    activeChapter === chapter.id ? 'bg-white dark:bg-indigo-500/20 shadow-sm' : 'bg-slate-100 dark:bg-white/5'
                  }`}>
                    {chapter.icon}
                  </div>
                  <span className="text-sm font-medium text-left">{chapter.title[lang]}</span>
                  {activeChapter === chapter.id && (
                    <motion.div layoutId="active-indicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  )}
                </button>
              ))}
            </nav>

            <div className="p-4 border-t border-slate-100 dark:border-white/5">
              <button 
                onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">{lang === 'vi' ? 'Tiếng Việt' : 'English'}</span>
                </div>
                <div className="text-[10px] font-bold text-indigo-500">{lang === 'vi' ? 'VI' : 'EN'}</div>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto custom-scrollbar flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-400">
              <span>Dissertation</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-900 dark:text-white">{CHAPTERS.find(c => c.id === activeChapter)?.title[lang]}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder={lang === 'vi' ? 'Tìm kiếm tài liệu...' : 'Search papers...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-white/5 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64 transition-all"
              />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 lg:p-10 space-y-12 max-w-7xl mx-auto w-full">
          {/* Hero Section */}
          <section className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="academic-card p-10 relative overflow-hidden group border-l-4 border-l-indigo-600"
            >
              <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                <Globe className="w-32 h-32" />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500 mb-4 block">
                {lang === 'en' ? 'Doctoral Dissertation' : 'Luận án Tiến sĩ'}
              </span>
              <h1 className="text-4xl md:text-5xl font-serif font-bold italic mb-6 text-slate-900 dark:text-white leading-tight">
                {DISSERTATION_TITLE}
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mb-8">
                {lang === 'en' 
                  ? 'Investigating the complex relationship between internationalization and business performance across Asian institutional regimes.'
                  : 'Nghiên cứu mối quan hệ phức tạp giữa quốc tế hóa và hiệu quả hoạt động kinh doanh qua các chế độ thể chế tại Châu Á.'}
              </p>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                    <User className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500">Author</p>
                    <p className="text-sm font-bold">Đỗ Thùy Hương</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                    <Award className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500">Degree</p>
                    <p className="text-sm font-bold">PhD in International Business</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Research Overview */}
          <ContentSection 
            title={{ en: 'Research Overview', vi: 'Tổng quan nghiên cứu' }} 
            icon={<Info className="w-5 h-5 text-indigo-500" />}
            lang={lang}
          >
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h4 className="font-serif font-bold text-lg text-indigo-400 italic">
                  {lang === 'en' ? 'Core Objectives' : 'Mục tiêu cốt lõi'}
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {lang === 'en' 
                    ? 'This research suggests that the DOI-FP relationship is not universal but is consistent with institutional contingencies in Asia.'
                    : 'Nghiên cứu này gợi ý rằng mối quan hệ DOI-FP không phải là phổ quát mà nhất quán với các điều kiện thể chế tại Châu Á.'}
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="font-serif font-bold text-lg text-emerald-400 italic">
                  {lang === 'en' ? 'Key Pillars' : 'Trụ cột chính'}
                </h4>
                <ul className="text-sm text-slate-400 space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-emerald-500" />
                    {lang === 'en' ? 'DOI–FP Relationship' : 'Mối quan hệ DOI–FP'}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-emerald-500" />
                    {lang === 'en' ? 'Institutional Regimes' : 'Chế độ thể chế'}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-emerald-500" />
                    {lang === 'en' ? 'Digital Paradox Lifecycle' : 'Vòng đời nghịch lý số'}
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-serif font-bold text-lg text-amber-400 italic">
                  {lang === 'en' ? 'Data Source' : 'Nguồn dữ liệu'}
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {lang === 'en' 
                    ? 'Utilizing comprehensive firm-level data from the World Bank Enterprise Surveys (WBES) across multiple Asian economies.'
                    : 'Sử dụng dữ liệu cấp doanh nghiệp toàn diện từ Khảo sát Doanh nghiệp của Ngân hàng Thế giới (WBES) qua nhiều nền kinh tế Châu Á.'}
                </p>
              </div>
            </div>
          </ContentSection>

          {/* Theoretical Framework */}
          <ContentSection 
            title={{ en: 'Theoretical Framework (ICRV)', vi: 'Khung lý thuyết (ICRV)' }} 
            icon={<Layers className="w-5 h-5 text-indigo-500" />}
            lang={lang}
          >
            <div className="space-y-8">
              <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5">
                <p className="text-slate-300 leading-relaxed italic mb-4">
                  {lang === 'en' 
                    ? 'The Institutionally-Contingent Resource View (ICRV) is presented as a mid-range integrative framework that bridges firm-level resources with country-level institutional environments.'
                    : 'Quan điểm Nguồn lực Phụ thuộc vào Thể chế (ICRV) được trình bày như một khung tích hợp tầm trung kết nối nguồn lực cấp doanh nghiệp với môi trường thể chế cấp quốc gia.'}
                </p>
                <div className="grid sm:grid-cols-2 gap-6 mt-6">
                  <div className="p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
                    <h5 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">
                      {lang === 'en' ? 'Firm-Level Effects' : 'Hiệu ứng cấp doanh nghiệp'}
                    </h5>
                    <p className="text-xs text-slate-400">
                      {lang === 'en' ? 'Focus on Foundational Digital Capabilities (FDCI) and resource orchestration.' : 'Tập trung vào Năng lực số nền tảng (FDCI) và điều phối nguồn lực.'}
                    </p>
                  </div>
                  <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                    <h5 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">
                      {lang === 'en' ? 'Country-Level Effects' : 'Hiệu ứng cấp quốc gia'}
                    </h5>
                    <p className="text-xs text-slate-400">
                      {lang === 'en' ? 'Institutional quality, market openness, and regulatory regimes.' : 'Chất lượng thể chế, độ mở thị trường và các chế độ quy định.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ContentSection>

          {/* Data & Methods */}
          <ContentSection 
            title={{ en: 'Data & Methods (WBES)', vi: 'Dữ liệu & Phương pháp' }} 
            icon={<Database className="w-5 h-5 text-emerald-500" />}
            lang={lang}
          >
            <div className="space-y-6">
              <p className="text-slate-400 leading-relaxed">
                {lang === 'en' 
                  ? 'The empirical analysis is based on firm-level data from the World Bank Enterprise Surveys (WBES), covering over 15,000 firms across various Asian economies. The research employs a switching regression model to identify distinct institutional regimes.'
                  : 'Phân tích thực nghiệm dựa trên dữ liệu cấp doanh nghiệp từ Khảo sát Doanh nghiệp của Ngân hàng Thế giới (WBES), bao gồm hơn 15.000 doanh nghiệp tại các nền kinh tế Châu Á khác nhau. Nghiên cứu sử dụng mô hình hồi quy chuyển đổi để xác định các chế độ thể chế riêng biệt.'}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: { en: 'Sample Size', vi: 'Cỡ mẫu' }, value: '15,000+' },
                  { label: { en: 'Economies', vi: 'Nền kinh tế' }, value: '12' },
                  { label: { en: 'Timeframe', vi: 'Thời gian' }, value: '2015-2022' },
                  { label: { en: 'Model', vi: 'Mô hình' }, value: 'Switching Reg.' }
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label[lang]}</p>
                    <p className="text-lg font-bold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </ContentSection>

          {/* Interactive Analysis */}
          <section className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="academic-card p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-white mb-1">
                      {lang === 'en' ? 'DOI-FP Relationship' : 'Mối quan hệ DOI-FP'}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {lang === 'en' ? 'Switch between regimes to see the theoretical curve.' : 'Chuyển đổi giữa các chế độ để xem đường cong lý thuyết.'}
                    </p>
                  </div>
                  <div className="flex bg-slate-900 rounded-lg p-1">
                    {['I', 'II', 'III'].map(r => (
                      <button
                        key={r}
                        onClick={() => setActiveRegime(r)}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeRegime === r ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <RegimeChart regime={activeRegime} lang={lang} />
                <div className="mt-6 p-4 bg-slate-900/50 rounded-xl border border-white/5">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {activeRegime === 'I' && (lang === 'en' ? 'Regime I suggests an amplification effect where internationalization strongly enhances performance.' : 'Chế độ I gợi ý hiệu ứng khuếch đại nơi quốc tế hóa thúc đẩy mạnh mẽ hiệu quả.')}
                    {activeRegime === 'II' && (lang === 'en' ? 'Regime II is consistent with a weak digital paradox, showing diminishing returns at high DOI levels.' : 'Chế độ II nhất quán với nghịch lý số yếu, cho thấy lợi nhuận giảm dần ở mức DOI cao.')}
                    {activeRegime === 'III' && (lang === 'en' ? 'Regime III represents the Digital Paradox Lifecycle (DPL), where digitalization costs may outweigh benefits.' : 'Chế độ III đại diện cho Vòng đời Nghịch lý Số (DPL), nơi chi phí số hóa có thể vượt quá lợi ích.')}
                  </p>
                </div>
              </div>

              <div className="academic-card p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-500" />
                    {lang === 'en' ? 'Paper Statistics' : 'Thống kê tài liệu'}
                  </h3>
                </div>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0F172A', border: 'none', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#6366f1' }}
                      />
                      <Bar 
                        dataKey="count" 
                        radius={[4, 4, 0, 0]}
                        onClick={(data) => setSelectedYear(parseInt(data.name))}
                        cursor="pointer"
                      >
                        {barChartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={selectedYear === parseInt(entry.name) ? '#6366f1' : '#334155'} 
                            className="transition-all duration-300"
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <AnimatePresence>
                  {selectedYear && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 overflow-hidden"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[10px] font-bold uppercase text-indigo-500 tracking-widest">
                          {lang === 'en' ? `Papers from ${selectedYear}` : `Tài liệu năm ${selectedYear}`}
                        </h4>
                        <button onClick={() => setSelectedYear(null)} className="text-[9px] text-slate-400 hover:text-slate-600 uppercase font-bold">
                          {lang === 'en' ? 'Close' : 'Đóng'}
                        </button>
                      </div>
                      <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                        {SAMPLE_PAPERS.filter(p => p.year === selectedYear).map(paper => (
                          <div key={paper.id} className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800">
                            <p className="text-[11px] font-bold text-white mb-0.5 leading-tight">{paper.title}</p>
                            <p className="text-[9px] text-slate-500 italic">{paper.author} • {paper.journal}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <Dashboard lang={lang} />
          </section>

          {/* Results & Discussion */}
          <ContentSection 
            title={{ en: 'Results & Discussion', vi: 'Kết quả & Thảo luận' }} 
            icon={<TrendingUp className="w-5 h-5 text-amber-500" />}
            lang={lang}
          >
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <h4 className="text-lg font-serif font-bold text-white italic">
                  {lang === 'en' ? 'The Digital Paradox Lifecycle (DPL)' : 'Vòng đời nghịch lý số (DPL)'}
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {lang === 'en'
                    ? 'Our findings suggest a non-linear relationship between digitalization and performance. Firms often experience a "Digital Paradox" where initial investments do not immediately translate into performance gains, especially in weak institutional environments.'
                    : 'Kết quả của chúng tôi gợi ý mối quan hệ phi tuyến giữa số hóa và hiệu quả. Các doanh nghiệp thường gặp phải "Nghịch lý số" khi các khoản đầu tư ban đầu không chuyển hóa ngay lập tức thành lợi ích hiệu quả, đặc biệt là trong môi trường thể chế yếu.'}
                </p>
                <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                  <p className="text-xs text-amber-200/70 italic">
                    {lang === 'en'
                      ? '"The digital paradox is consistent with the lack of foundational digital capabilities (FDCI) in certain regimes."'
                      : '"Nghịch lý số nhất quán với việc thiếu hụt các năng lực số nền tảng (FDCI) trong một số chế độ nhất định."'}
                  </p>
                </div>
              </div>
              <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                <h4 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-widest">
                  {lang === 'en' ? 'Comparative Network Analysis' : 'Phân tích mạng lưới so sánh'}
                </h4>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={RADAR_DATA}>
                      <PolarGrid stroke="#1e293b" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                      <Radar name="Current" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                      <Radar name="Target" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </ContentSection>

          {/* Key Findings & Contributions */}
          <ContentSection 
            title={{ en: 'Key Findings & Contributions', vi: 'Kết quả & Đóng góp chính' }} 
            icon={<Award className="w-5 h-5 text-indigo-500" />}
            lang={lang}
          >
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h4 className="text-sm font-bold uppercase tracking-widest text-indigo-500">
                  {lang === 'en' ? 'Empirical Findings' : 'Kết quả thực nghiệm'}
                </h4>
                <div className="space-y-4">
                  {[
                    { en: 'DOI-FP relationship varies significantly across institutional regimes.', vi: 'Mối quan hệ DOI-FP thay đổi đáng kể qua các chế độ thể chế.' },
                    { en: 'Foundational Digital Capabilities (FDCI) moderate the internationalization effect.', vi: 'Năng lực số nền tảng (FDCI) điều tiết hiệu ứng quốc tế hóa.' },
                    { en: 'Institutional quality acts as a critical boundary condition.', vi: 'Chất lượng thể chế đóng vai trò là một điều kiện biên quan trọng.' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center text-[10px] font-bold text-indigo-500">
                        {i + 1}
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {lang === 'en' ? item.en : item.vi}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <h4 className="text-sm font-bold uppercase tracking-widest text-emerald-500">
                  {lang === 'en' ? 'Theoretical Contributions' : 'Đóng góp lý thuyết'}
                </h4>
                <div className="space-y-4">
                  {[
                    { en: 'Extending the Resource-Based View with institutional contingencies.', vi: 'Mở rộng Quan điểm dựa trên Nguồn lực với các điều kiện thể chế.' },
                    { en: 'Developing the Foundational Digital Capability Index (FDCI).', vi: 'Phát triển Chỉ số Năng lực số nền tảng (FDCI).' },
                    { en: 'Conceptualizing the Digital Paradox Lifecycle (DPL).', vi: 'Khái niệm hóa Vòng đời Nghịch lý Số (DPL).' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-[10px] font-bold text-emerald-500">
                        {i + 1}
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {lang === 'en' ? item.en : item.vi}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ContentSection>

          {/* Research Agenda & Pipeline */}
          <ContentSection 
            title={{ en: 'Research Agenda & Pipeline', vi: 'Chương trình & Lộ trình nghiên cứu' }} 
            icon={<Network className="w-5 h-5 text-indigo-500" />}
            lang={lang}
          >
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { 
                  title: { en: 'Digital Transformation', vi: 'Chuyển đổi số' },
                  status: { en: 'Ongoing', vi: 'Đang thực hiện' },
                  desc: { en: 'Exploring the role of AI in SME internationalization.', vi: 'Khám phá vai trò của AI trong quốc tế hóa SME.' }
                },
                { 
                  title: { en: 'Institutional Dynamics', vi: 'Động lực thể chế' },
                  status: { en: 'Planned', vi: 'Đã lập kế hoạch' },
                  desc: { en: 'Comparative study of Asian vs. European regimes.', vi: 'Nghiên cứu so sánh các chế độ Châu Á và Châu Âu.' }
                },
                { 
                  title: { en: 'Sustainability', vi: 'Bền vững' },
                  status: { en: 'In Review', vi: 'Đang bình duyệt' },
                  desc: { en: 'Green internationalization strategies in emerging markets.', vi: 'Chiến lược quốc tế hóa xanh tại các thị trường mới nổi.' }
                }
              ].map((item, i) => (
                <div key={i} className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-serif font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {item.title[lang]}
                    </h5>
                    <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 bg-white/5 rounded text-slate-500">
                      {item.status[lang]}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc[lang]}
                  </p>
                </div>
              ))}
            </div>
          </ContentSection>

          {/* Policy Implications */}
          <ContentSection 
            title={{ en: 'Policy Implications', vi: 'Hàm ý chính sách' }} 
            icon={<ShieldCheck className="w-5 h-5 text-indigo-500" />}
            lang={lang}
          >
            <div className="grid md:grid-cols-2 gap-12">
              <div className="p-8 bg-indigo-500/5 rounded-3xl border border-indigo-500/10">
                <h4 className="text-lg font-serif font-bold text-indigo-400 mb-6 italic">
                  {lang === 'en' ? 'For Managers' : 'Dành cho nhà quản lý'}
                </h4>
                <ul className="space-y-4 text-sm text-slate-400">
                  <li className="flex gap-3">
                    <Zap className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-1" />
                    <span>{lang === 'en' ? 'Prioritize Foundational Digital Capabilities before aggressive expansion.' : 'Ưu tiên Năng lực số nền tảng trước khi mở rộng mạnh mẽ.'}</span>
                  </li>
                  <li className="flex gap-3">
                    <Zap className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-1" />
                    <span>{lang === 'en' ? 'Adapt internationalization strategies to local institutional quality.' : 'Thích ứng chiến lược quốc tế hóa với chất lượng thể chế địa phương.'}</span>
                  </li>
                </ul>
              </div>
              <div className="p-8 bg-emerald-500/5 rounded-3xl border border-emerald-500/10">
                <h4 className="text-lg font-serif font-bold text-emerald-400 mb-6 italic">
                  {lang === 'en' ? 'For Policymakers' : 'Dành cho nhà hoạch định'}
                </h4>
                <ul className="space-y-4 text-sm text-slate-400">
                  <li className="flex gap-3">
                    <Zap className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-1" />
                    <span>{lang === 'en' ? 'Strengthen institutional frameworks to support firm digitalization.' : 'Củng cố khung thể chế để hỗ trợ số hóa doanh nghiệp.'}</span>
                  </li>
                  <li className="flex gap-3">
                    <Zap className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-1" />
                    <span>{lang === 'en' ? 'Reduce market barriers to enhance the DOI-FP amplification effect.' : 'Giảm rào cản thị trường để tăng cường hiệu ứng khuếch đại DOI-FP.'}</span>
                  </li>
                </ul>
              </div>
            </div>
          </ContentSection>

          {/* Evidence Database */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-serif font-bold italic flex items-center gap-3">
                <Database className="w-6 h-6 text-indigo-500" />
                {lang === 'en' ? 'Evidence Database' : 'Cơ sở dữ liệu bằng chứng'}
              </h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder={lang === 'en' ? 'Search papers...' : 'Tìm kiếm tài liệu...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-white/5 border-none rounded-full text-xs focus:ring-2 focus:ring-indigo-500 outline-none w-48 transition-all"
                  />
                </div>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPapers.map((paper) => (
                <motion.div 
                  layout
                  key={paper.id}
                  className="academic-card p-6 flex flex-col h-full hover:border-indigo-500/50 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 dark:bg-white/5 rounded-full text-slate-500">
                      {paper.year}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold mb-2 line-clamp-2 group-hover:text-indigo-400 transition-colors">
                    {paper.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 italic">
                    {paper.author} — {paper.journal}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {paper.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-bold uppercase tracking-tighter px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <button className="text-xs font-bold text-indigo-500 flex items-center gap-1 hover:gap-2 transition-all">
                      {lang === 'en' ? 'View Details' : 'Xem chi tiết'}
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <ContentSection 
            title={{ en: 'Contact & Collaboration', vi: 'Liên hệ & Hợp tác' }} 
            icon={<Mail className="w-5 h-5 text-indigo-500" />}
            lang={lang}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 max-w-lg">
                <p className="text-slate-400 leading-relaxed">
                  {lang === 'en' 
                    ? 'Interested in discussing the findings or exploring collaborative research opportunities? Feel free to reach out.'
                    : 'Bạn quan tâm đến việc thảo luận về các kết quả nghiên cứu hoặc khám phá các cơ hội hợp tác nghiên cứu? Đừng ngần ngại liên hệ.'}
                </p>
                <div className="flex items-center gap-4">
                  <a href="mailto:ThuyHuongCTU@gmail.com" className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all">
                    <Mail className="w-4 h-4" />
                    {lang === 'en' ? 'Send Email' : 'Gửi Email'}
                  </a>
                  <div className="flex items-center gap-2 text-slate-400">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm">Response within 48h</span>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-auto">
                <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4">Social Profiles</p>
                  <div className="flex gap-4">
                    {['LinkedIn', 'ResearchGate', 'Scholar'].map(s => (
                      <button key={s} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold transition-all">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ContentSection>
        </div>

        {/* Footer */}
        <footer className="mt-auto p-10 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-[#0F172A]">
          <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <BookMarked className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-serif font-bold italic">Dissertation Evidence Map</h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
                A comprehensive visualization and database of research evidence supporting the doctoral dissertation on internationalization strategies in the Asian context.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4">{lang === 'vi' ? 'Liên kết' : 'Links'}</h4>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li className="hover:text-indigo-500 cursor-pointer transition-colors">ResearchGate</li>
                <li className="hover:text-indigo-500 cursor-pointer transition-colors">Google Scholar</li>
                <li className="hover:text-indigo-500 cursor-pointer transition-colors">LinkedIn Profile</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4">{lang === 'vi' ? 'Bản quyền' : 'Copyright'}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                © 2026 Đỗ Thùy Hương.<br />All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>

      {/* AI Chatbot Integration */}
      <AIChatbot lang={lang} />
    </div>
  );
};

export default App;
