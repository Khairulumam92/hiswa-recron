// Download result as PNG using html-to-image
// Minimal implementation: just copies text to clipboard if html-to-image not available
export async function downloadResultAsImage(elementId: string): Promise<void> {
  try {
    // Try html-to-image if available
    const { toPng } = await import('html-to-image' as any);
    const el = document.getElementById(elementId);
    if (!el) return;
    const dataUrl = await toPng(el);
    const link = document.createElement('a');
    link.download = 'mijn-recreatie-rol.png';
    link.href = dataUrl;
    link.click();
  } catch {
    // Fallback: just copy URL
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
    }
  }
}
