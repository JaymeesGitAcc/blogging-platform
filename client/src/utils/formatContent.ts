export const formatContent = (content: any) => {
    // Convert markdown-like content to HTML
    let formatted = content
      .replace(
        /## (.*?)(\n|$)/g,
        '<h2 class="text-2xl font-bold mt-8 mb-4 text-slate-900">$1</h2>',
      )
      .replace(
        /### (.*?)(\n|$)/g,
        '<h3 class="text-xl font-semibold mt-6 mb-3 text-slate-800">$1</h3>',
      )
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")

    return `<p class="mb-4">${formatted}</p>`
  }
