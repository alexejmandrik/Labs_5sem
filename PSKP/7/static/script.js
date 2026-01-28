async function loadData() {

    const output = document.getElementById('output');

    try {
        const jsonResp = await fetch('data.json');
        const jsonData = await jsonResp.json();

        const xmlResp = await fetch('data.xml');
        const xmlText = await xmlResp.text();

        output.innerHTML = `
            <h3>JSON:</h3>
            <pre>${JSON.stringify(jsonData, null, 2)}</pre>
            <h3>XML:</h3>
            <pre>${xmlText}</pre>
        `;
    } catch (err) {
        output.textContent = 'Ошибка загрузки данных: ' + err;
    }
}

window.addEventListener('DOMContentLoaded', loadData);
