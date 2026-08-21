%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%  Lớp trình bày CV hai cột (dựa trên template-2 "Dublin" của             %%
%%  amirzenoozi/latex-cv-templates, MIT License - xem LICENSE-template.txt) %%
%%                                                                          %%
%%  Đã chỉnh sửa để hỗ trợ tiếng Việt có dấu:                               %%
%%    - biên dịch bằng XeLaTeX hoặc LuaLaTeX (fontspec + font Unicode)       %%
%%    - bổ sung các lệnh cho mục chứng chỉ, ngày sinh, danh sách gọn         %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\ProvidesClass{main}[2026/08/21 CV hai cột hỗ trợ tiếng Việt]
\LoadClass[10pt]{article}

\RequirePackage[margin=0cm]{geometry}
\usepackage{microtype}
\usepackage{enumitem}
\usepackage{microtype}
\usepackage{hyperref}
\usepackage{graphicx}
\usepackage{paracol}
\usepackage{tcolorbox}
\usepackage{environ}
\usepackage{adjustbox}
\usepackage{anyfontsize}
\usepackage{ragged2e}
\usepackage{ifthen}
\usepackage{tikz}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% Font: phải là font Unicode có đủ dấu tiếng Việt.                         %%
%% Ưu tiên Roboto; nếu máy không có thì tự động lùi về TeX Gyre Heros       %%
%% (bản sao Helvetica đi kèm TeX Live, hỗ trợ đầy đủ tiếng Việt).           %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\RequirePackage{iftex}
\RequireXeTeX
\RequirePackage{fontspec}
\RequirePackage{polyglossia}
\setdefaultlanguage{vietnamese}

%% 1) Roboto cài kèm TeX Live / Overleaf (tra theo tên file)
\IfFontExistsTF{Roboto-Regular.ttf}{
    \setsansfont{Roboto}[
        Extension      = .ttf,
        UprightFont    = *-Regular,
        BoldFont       = *-Bold,
        ItalicFont     = *-Italic,
        BoldItalicFont = *-BoldItalic,
    ]
}{%% 2) Roboto cài trong hệ điều hành (tra theo tên font)
 \IfFontExistsTF{Roboto}{
    \setsansfont{Roboto}
 }{%% 3) Dự phòng: TeX Gyre Heros - luôn có sẵn trong TeX Live, đủ dấu tiếng Việt
  \IfFontExistsTF{texgyreheros-regular.otf}{
    \setsansfont{texgyreheros}[
        Extension      = .otf,
        UprightFont    = *-regular,
        BoldFont       = *-bold,
        ItalicFont     = *-italic,
        BoldItalicFont = *-bolditalic,
    ]
  }{
    \setsansfont{TeX Gyre Heros}
  }
 }
}
\renewcommand{\familydefault}{\sfdefault}
\linespread{1.15}


%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% Define Color Variables %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\RequirePackage{xcolor}
\definecolor{DGreen}{HTML}{084B41}
\definecolor{Black}{HTML}{000000}
\definecolor{White}{HTML}{FFFFFF}
\definecolor{lightGreen}{HTML}{4D837B}
\definecolor{lightGray}{HTML}{808080}

\colorlet{accent}{DGreen}
\colorlet{body}{Black!80}
\colorlet{white50}{White!88}  % sáng hơn bản gốc để chữ trên nền xanh dễ đọc khi in
\colorlet{lgreen}{lightGreen}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% Import FontAwesome Icons %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\RequirePackage{fontawesome5}  % fontawesome5 kèm sẵn file .otf nên chạy được với XeLaTeX
\newcommand{\emailsymbol}{\faAt}
\newcommand{\phonesymbol}{\faPhone}
\newcommand{\homepagesymbol}{\faLink}
\newcommand{\locationsymbol}{\faMapMarker}
\newcommand{\linkedinsymbol}{\faLinkedinIn}
\newcommand{\twittersymbol}{\faTwitter}
\newcommand{\githubsymbol}{\faGithub}
\newcommand{\orcidsymbol}{\aiOrcid}
\newcommand{\mailsymbol}{\faEnvelope}
\newcommand{\devsymbol}{\faCode}

%%%%%%%%%%%%%%%%%%%%%%%%
%% Set Skip Variables %%
%%%%%%%%%%%%%%%%%%%%%%%%
\setlength{\smallskipamount}{10pt}
\setlength{\medskipamount}{15pt}
\setlength{\bigskipamount}{20pt}
\newcommand{\tinyskip}[0]{
    \vspace{5pt}
}

%%%%%%%%%%%%%%%%%%%
%% Grid Commands %%
%%%%%%%%%%%%%%%%%%%
\NewEnviron{leftpart}[1]{
    \begin{minipage}{#1\textwidth}
        \begin{tcolorbox}[colback=DGreen, boxrule=0pt, height=\textheight,
                          width=\textwidth, sharp corners,
                          left=5mm, right=5mm, top=1cm, bottom=1cm]
            \BODY
        \end{tcolorbox}
    \end{minipage}
}


\NewEnviron{rightpart}[1]{%
    \begin{minipage}{#1\textwidth}
    \begin{tcolorbox}[colback=white, boxrule=0pt, 
                      height=\textheight,
                      left=5mm, right=5mm,
                      top=1cm, bottom=1cm,
                      sharp corners]
            \raggedright
            \color{Black}
            \BODY
        \end{tcolorbox}
    \end{minipage}
}

%%%%%%%%%%%%%%%%%%
%% Avatar Frame %%
%%%%%%%%%%%%%%%%%%
\newcommand{\avatar}[1]{
    \begin{tikzpicture}
        \clip (0,0) circle (1.5cm);
        \node at (0,0) {\includegraphics[width=3cm]{#1}};
    \end{tikzpicture}
}

\newcommand{\fullname}[1]{
    \textcolor{white50}{\textbf{\Huge{#1}}}
}

%%%%%%%%%%%%%%%%%%
%% Profile Info %%
%%%%%%%%%%%%%%%%%%
\newcommand{\intro}[3]{
    \begin{center}
        \avatar{#1} \\
        \medskip
        \fullname{#2} \\
        \textcolor{white50}{\rule{1cm}{1mm}} \\
        \vspace{1mm}
        \textcolor{white50}{\large{#3}} \\
        \bigskip
    \end{center}
    \
}

%%%%%%%%%%%%%%%%%%%%%
%% Profile Details %%
%%%%%%%%%%%%%%%%%%%%%
\newcommand{\printinfo}[2]{\mbox{\textcolor{white50}{#1}\hspace{0.5em}#2\hspace{2em}}}
\newcommand{\printtitle}[1]{\mbox{\textcolor{white50}{\diamondsh}\hspace{0.5em}\Large{#1}\hspace{2em}}}

\newcommand{\email}[1]{\printinfo{\emailsymbol}{#1}}
\newcommand{\mailaddress}[1]{\printinfo{\emailsymbol}{\href{mailto:#1}{#1}}}
\newcommand{\phone}[1]{\printinfo{\phonesymbol}{\href{tel:#1}{#1}}}
\newcommand{\homepage}[2]{\printinfo{\homepagesymbol}{\href{#2}{#1}}}
\newcommand{\twitter}[1]{\printinfo{\twittersymbol}{#1}}
\newcommand{\linkedin}[1]{\printinfo{\linkedinsymbol}{\href{http://linkedin.com/in/#1}{#1}}}
\newcommand{\github}[1]{\printinfo{\githubsymbol}{\href{http://github.com/#1}{#1}}}
\newcommand{\orcid}[1]{\printinfo{\orcidsymbol}{#1}}
\newcommand{\location}[1]{\printinfo{\locationsymbol}{#1}}
\newcommand{\personalinfo}[1]{\def\@personalinfo{#1}}

\newcommand{\contact}[5]{
    \textcolor{white50}{
        {\Large{Details}\smallskip} \\
        \location{#1} \\
        \mailaddress{#2} \\
        \phone{#3} \\
        \linkedin{#4} \\
        \github{#5} \\
    }
}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% Progress Bar                %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% Variables:                  %%
%% #1 = Width                  %%
%% #2 = Height                 %%
%% #3 = Percentage             %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% Example:                    %%
%% \progressbar{5cm}{0.2}{100} %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\newcommand{\progressbar}[3]{
    \begin{tikzpicture}
        % Draw the background bar
        \fill[lightGreen] (0,0) rectangle (#1, #2);
        % Draw the progress bar
        \fill[white] (0,0) rectangle (#1 * #3 / 100, #2);
    \end{tikzpicture}
}

\newcommand{\diamondsh}{%
    \begin{tikzpicture}[baseline=-0.75ex]
        \filldraw[fill=white50, draw=white50] (0, 0) -- (1.5mm, 1.5mm) -- (3mm, 0) -- (1.5mm, -1.5mm) -- cycle;
    \end{tikzpicture}%
}

%%%%%%%%%%%%%%%%%%%%
%% Custom Divider %%
%%%%%%%%%%%%%%%%%%%%
\newcommand{\dotteddivider}{
    \vspace{-0.1cm}
    \begin{center}
        \begin{tikzpicture}
            \draw[dotted, line width=0.5pt] (0,0) -- (10,0); % Adjust length as needed
        \end{tikzpicture}
    \end{center}
    \vspace{-0.55cm}
}

%%%%%%%%%%%%
%% Skills %%
%%%%%%%%%%%%
\newcommand{\skillset}[2]{
    \raggedright{\small{#1}} \\
    \progressbar{5cm}{0.2}{#2} \\
    \tinyskip
}

\newcommand{\whitesect}[2]{
    \textcolor{white50}{
        \\
        {\Large{#1}\smallskip} \\
        #2
    }
}

\newcommand{\sect}[2]{
    \textcolor{body}{
        \\
        {\Large{\textbf{#1}}\smallskip} \\
        #2
    }
}

\newcommand{\expset}[3]{
    \textcolor{body}{
        \textbf{#1} \\
        \textcolor{lightGray}{\footnotesize{#2}} \\
        \smallskip
        \setlength{\leftmargini}{0.75cm}
        #3
    }
}

\newcommand{\eduset}[2]{
    \textcolor{body}{
        \textbf{#1} \\
        \textcolor{lightGray}{\footnotesize{#2}} \\
        \smallskip
    }
}

\newcommand{\referenceset}[3]{
    \textcolor{body}{
        \textbf{#1} \\
        \textcolor{lightGray}{{\href{mailto:#2}{#2}} \hspace{5pt} $|$ \hspace{5pt} {\href{tel:#3}{#3}}}  \\
        \smallskip
    }
}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%  Bổ sung cho CV ngành Dược (tiếng Việt)                                  %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%% Ngày sinh trong khối thông tin liên hệ
\newcommand{\birthdaysymbol}{\faCalendar}
\newcommand{\birthday}[1]{\printinfo{\birthdaysymbol}{#1}}

%% Địa chỉ dài: cho phép xuống dòng thay vì tràn khỏi cột
\renewcommand{\location}[1]{%
    \mbox{\textcolor{white50}{\locationsymbol}}\hspace{0.5em}%
    \parbox[t]{0.78\linewidth}{\raggedright #1}%
}

%% Gạch đầu dòng gọn trong cột trái (không dùng itemize để giữ màu trắng)
\newcommand{\sideitem}[1]{%
    \noindent\makebox[0.8em][l]{\textcolor{white50}{\footnotesize\textbullet}}%
    \parbox[t]{\dimexpr\linewidth-0.9em\relax}{\raggedright\small #1}\\[2pt]
}

%% Danh sách gạch đầu dòng gọn ở cột phải
\newenvironment{cvitems}{%
    \setlength{\leftmargini}{0.7cm}%
    \begin{itemize}[topsep=2pt, itemsep=2pt, parsep=0pt, leftmargin=0.7cm, label=\textbullet]%
}{\end{itemize}}

%% Một mục kinh nghiệm: chức danh / nơi làm việc / thời gian / nội dung
\newcommand{\jobset}[4]{%
    \textcolor{body}{%
        \textbf{#1} \\
        \textcolor{lightGray}{\footnotesize{#2 \hspace{4pt}$\vert$\hspace{4pt} #3}} \\
        \smallskip
        #4
    }
}

%% Một mục chứng chỉ / giấy tờ hành nghề
\newcommand{\certset}[2]{%
    \textcolor{body}{%
        \noindent\makebox[0.8em][l]{\footnotesize\textbullet}%
        \parbox[t]{\dimexpr\linewidth-0.9em\relax}{\raggedright #1%
            \ifthenelse{\equal{#2}{}}{}{\\[1pt]\textcolor{lightGray}{\footnotesize #2}}}\\[4pt]
    }
}

%% Tiêu đề mục ở cột phải, phiên bản gọn hơn (ít khoảng trắng phía trên)
\newcommand{\tightsect}[2]{%
    \textcolor{body}{%
        {\large\textbf{#1}}\\[2pt]
        #2
    }
}

%% Số điện thoại: tách phần hiển thị và phần liên kết tel: (tránh khoảng trắng trong URL)
\newcommand{\phonelink}[2]{\printinfo{\phonesymbol}{\href{tel:#2}{#1}}}
