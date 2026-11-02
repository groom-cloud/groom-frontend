import React, { useState } from 'react';
import { Download, Printer, Code2, Copy, Check } from 'lucide-react';

interface ExportDropdownProps {
  title: string;
  getMarkdown: () => string;
  getHtml?: () => string;
  onShowToast: (msg: string) => void;
  buttonLabel?: string;
}

export const ExportDropdown: React.FC<ExportDropdownProps> = ({
  title,
  getMarkdown,
  getHtml,
  onShowToast,
  buttonLabel = '내보내기 (PDF / Word)'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const defaultHtml = () => {
    const md = getMarkdown();
    const safeTitle = title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<title>${safeTitle}</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Malgun Gothic', sans-serif; color: #1d1d1f; line-height: 1.65; max-width: 820px; margin: 40px auto; padding: 0 24px; }
  h1 { font-size: 24px; border-bottom: 2px solid #1d1d1f; padding-bottom: 12px; margin-bottom: 20px; }
  h2 { font-size: 17px; margin-top: 28px; margin-bottom: 10px; color: #111; }
  p { font-size: 13.5px; color: #333; margin: 8px 0; }
  pre { background: #f5f5f7; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
  th, td { border: 1px solid #d2d2d7; padding: 9px 12px; text-align: left; }
  th { background-color: #f5f5f7; font-weight: 600; }
</style>
</head>
<body>
  <h1>${safeTitle}</h1>
  <pre style="white-space: pre-wrap;">${md.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body>
</html>`;
  };

  const handleExportPdf = () => {
    setIsOpen(false);
    const htmlContent = getHtml ? getHtml() : defaultHtml();
    const printWindow = window.open('', '_blank', 'width=900,height=720');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
      onShowToast('PDF 저장을 위한 인쇄 대화상자를 열었습니다');
    } else {
      window.print();
      onShowToast('브라우저 인쇄 창을 열었습니다');
    }
  };

  const handleExportWord = () => {
    setIsOpen(false);
    const htmlContent = getHtml ? getHtml() : defaultHtml();
    const blob = new Blob(['\ufeff', htmlContent], {
      type: 'application/msword;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/[\/\\?%*:|"<>]/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onShowToast('Word(.doc) 문서가 다운로드되었습니다');
  };

  const handleExportMarkdownFile = () => {
    setIsOpen(false);
    const md = getMarkdown();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/[\/\\?%*:|"<>]/g, '_')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onShowToast('Markdown(.md) 파일이 다운로드되었습니다');
  };

  const handleCopyMarkdown = () => {
    const md = getMarkdown();
    navigator.clipboard?.writeText(md).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setIsOpen(false);
    onShowToast('마크다운 원문이 클립보드에 복사되었습니다');
  };

  return (
    <div className="relative inline-block text-left shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-2.5 py-1.5 rounded-lg bg-well hover:bg-control text-ink text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap border border-line"
      >
        <Download className="w-3.5 h-3.5 text-muted" />
        <span className="hidden sm:inline">{buttonLabel}</span>
        <span className="sm:hidden">내보내기</span>
      </button>

      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40"
          />
          <div className="absolute right-0 top-full mt-1.5 w-52 bg-surface border border-line-strong rounded-xl p-1.5 z-50 text-xs space-y-0.5 shadow-lg">
            <button
              type="button"
              onClick={handleExportPdf}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-well text-ink flex items-center justify-between cursor-pointer transition-colors"
            >
              <span className="font-medium">PDF 문서로 저장 / 인쇄</span>
              <Printer className="w-3.5 h-3.5 text-muted" />
            </button>
            <button
              type="button"
              onClick={handleExportWord}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-well text-ink flex items-center justify-between cursor-pointer transition-colors"
            >
              <span className="font-medium">Word (.doc) 다운로드</span>
              <Download className="w-3.5 h-3.5 text-muted" />
            </button>
            <button
              type="button"
              onClick={handleExportMarkdownFile}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-well text-ink flex items-center justify-between cursor-pointer transition-colors"
            >
              <span className="font-medium">Markdown (.md) 다운로드</span>
              <Code2 className="w-3.5 h-3.5 text-muted" />
            </button>
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-well text-ink flex items-center justify-between cursor-pointer transition-colors border-t border-line mt-1 pt-2"
            >
              <span>마크다운 클립보드 복사</span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-ok" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-muted" />
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
