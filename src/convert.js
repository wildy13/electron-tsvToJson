const TsvParser = window.electronAPI.require("@smnblmrr/tsv-parser");

const converter = async (event) => {
    let data = [];

    await event.preventDefault();

    const fileInput = document.getElementById("file_input");

    const file = fileInput.files[0];
    const fileName = file.name.split('.').slice(0, -1).join('.');
    const reader = new FileReader();

    reader.onload = () => {
        const fileContent = reader.result;
        const readFile = fileContent.toString();

        const lines = readFile.split("\n")
        const headers = lines[0].split("\t")
        const filterHeaders = headers.filter(item => item !== '' && item !== '\r');
        for (let i = 1; i < lines.length; i++) {
            const obj = {};
            const currentline = lines[i].split("\t");

            for (let j = 0; j < filterHeaders.length; j++) {
                const fieldValue = currentline[j] ? currentline[j].replace(/\r$/, '') : '';
                obj[filterHeaders[j]] = fieldValue;
            }

            data.push(obj);
        }
        const jsonData = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonData], { type: "application/json" });
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = `${fileName}.json`;
        document.body.appendChild(downloadLink);

        downloadLink.click();

        document.body.removeChild(downloadLink);
    };
    reader.readAsText(file);
}

