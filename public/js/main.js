const socket = io();

const updateTable = (attendances) => {
    const tableBody = $("#table-attendances tbody");
    const tableExitBody = $("#table-exits tbody");

    tableBody.empty();
    tableExitBody.empty();

    attendances.forEach((attendance, i) => {
        const date = formatDate(attendance.created_at);
        const dateUpdate = formatDate(attendance.updated_at);

        if (attendance.hadir) {
            const element = `
                <tr>
                    <th scope="row">${i + 1}</th>
                    <td>${attendance.peserta.nama}</td>
                    <td>${attendance.peserta.nim}</td>
                    <td>${date}</td>
                </tr>
            `;

            tableBody.append(element);
        }
        
        if (attendance.keluar) {
            const element = `
                <tr>
                    <th scope="row">${i + 1}</th>
                    <td>${attendance.peserta.nama}</td>
                    <td>${attendance.peserta.nim}</td>
                    <td>${dateUpdate}</td>
                </tr>
            `;
            tableExitBody.append(element);
        }
    });
};

const addNewAttendance = (attendance) => {
    console.log(attendance);
    const date = formatDate(attendance.created_at);
    const dateUpdate = formatDate(attendance.updated_at);

    const tableBody = $("#table-attendances tbody");
    const tableExitBody = $("#table-exits tbody");

    // tableBody.prepend(element);
    if (attendance.hadir && !attendance.keluar) {
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
    }

    if (attendance.keluar) {
        const element = `
            <tr>
                <th scope="row">1</th>
                <td>${attendance.peserta.nama}</td>
                <td>${attendance.peserta.nim}</td>
                <td>${dateUpdate}</td>
            </tr>
        `;

        tableExitBody.prepend(element);

        tableExitBody.find('tr').each((i, el) => {
            $(el).find('th').text(i + 1);
        });
    }
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

socket.on('updateAttendance', (attendance) => {
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
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };

    return date.toLocaleDateString('id-ID', options).replace(',', '');
};