# Biên dịch CV bằng XeLaTeX (bắt buộc dùng XeLaTeX/LuaLaTeX để có dấu tiếng Việt)
PDF  := CV_VoVuongKhanhVy.pdf
SRC  := main.tex main.cls avatar.jpg

.PHONY: all clean distclean

all: $(PDF)

$(PDF): $(SRC)
	xelatex -interaction=nonstopmode -jobname=$(basename $(PDF)) main.tex
	xelatex -interaction=nonstopmode -jobname=$(basename $(PDF)) main.tex

clean:
	rm -f *.aux *.log *.out *.fls *.fdb_latexmk *.synctex.gz missfont.log

distclean: clean
	rm -f $(PDF)
