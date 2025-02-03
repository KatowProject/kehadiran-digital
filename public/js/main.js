const socket = io();

const updateTable = (attendances) => {
    const tableBody = $("#table-attendances tbody");
    tableBody.empty();

    attendances.forEach((attendance, i) => {
        const date = formatDate(attendance.created_at);
        console.log(date);
        const element = `
            <tr>
                <th scope="row">${i + 1}</th>
                <td>${attendance.peserta.nama}</td>
                <td>${attendance.peserta.nim}</td>
                <td>${date}</td>
            </tr>
        `;
        tableBody.append(element);
    });
};

const addNewAttendance = (attendance) => {
    const date = formatDate(attendance.created_at);
    const tableBody = $("#table-attendances tbody");

    const element = `
        <tr>
            <th scope="row">1</th>
            <td>${attendance.peserta.nama}</td>
            <td>${attendance.peserta.nim}</td>
            <td>${date}</td>
        </tr>
    `;

    tableBody.prepend(element);

    tableBody.find('tr').each((i, el) => {
        $(el).find('th').text(i + 1);
    });
};

socket.on('connect', () => {
    console.log('Connected to the WebSocket server');
});

socket.on('initialAttendances', (attendances) => {
    updateTable(attendances);
});

socket.on('newAttendance', (attendance) => {
    addNewAttendance(attendance);
});

socket.on('disconnect', () => {
    console.log('Disconnected from the WebSocket server');
});


// title create animation
const title = $('#title > h2');
const titleText = title.text();

title.empty();

for (let i = 0; i < titleText.length; i++) {
    setTimeout(() => {
        title.text(title.text() + titleText[i]);
    }, i * 100);
}


const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: false 
    };

    const offset = date.getTimezoneOffset();

    return date.toLocaleDateString('id-ID', options).replace(',', '') + ` GMT${offset > 0 ? '-' : '+'}${Math.abs(offset / 60)}`;
};