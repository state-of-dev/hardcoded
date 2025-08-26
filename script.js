(function() {
    function getVisibleTextNodes() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
            acceptNode: function(node) {
                if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                if (node.parentNode && getComputedStyle(node.parentNode).display === "none") return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        });

        let nodes = [];
        let node;
        while (node = walker.nextNode()) {
            let tag = node.parentNode.tagName;
            let path = getDomPath(node.parentNode);
            let text = node.nodeValue.trim().replace(/\s+/g, " ");
            nodes.push([tag, text, path]);
        }
        return nodes;
    }

    function getDomPath(el) {
        if (!el) return '';
        let stack = [];
        while (el.parentNode != null) {
            let sibCount = 0;
            let sibIndex = 0;
            for (let i = 0; i < el.parentNode.childNodes.length; i++) {
                let sib = el.parentNode.childNodes[i];
                if (sib.nodeName === el.nodeName) {
                    if (sib === el) {
                        sibIndex = sibCount;
                    }
                    sibCount++;
                }
            }
            let nodeName = el.nodeName.toLowerCase();
            if (sibCount > 1) {
                stack.unshift(`${nodeName}:eq(${sibIndex})`);
            } else {
                stack.unshift(nodeName);
            }
            el = el.parentNode;
        }
        return stack.slice(1).join(" > ");
    }

    function arrayToCSV(data) {
        return data.map(row => row.map(val => `"${val.replace(/"/g, '""')}"`).join(",")).join("\n");
    }

    function downloadCSV(csv, filename) {
        const BOM = "\uFEFF";
        let blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
        let link = document.createElement("a");
        let url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    let data = getVisibleTextNodes();
    data.unshift(["Etiqueta", "Texto", "Ruta DOM"]);

    let csv = arrayToCSV(data);
    downloadCSV(csv, "datos_completos_utf8.csv");
})();