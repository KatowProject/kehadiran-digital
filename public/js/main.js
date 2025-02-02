const socket = io();

socket.on('connect', () => {
    console.log('Connected to the WebSocket server');
});

socket.on('initialAttendances', (attendances) => {
    console.log('Initial Attendances:', attendances);
    const table = $("#table-attendances");

    // remove all rows in tbody
    table.find('tbody').empty();

    attendances.forEach((attendance, i) => {
        const date = new Date(attendance.created_at).toLocaleString();
        const element = `
            <tr>
                <th scope="row">${i + 1}</th>
                <td>${attendance.peserta.nama}</td>
                <td>${attendance.peserta.nim}</td>
                <td>${date}</td>
            </tr>
        `;

        table.find('tbody').append(element);
    });
});

socket.on('newAttendance', (attendance) => {
    console.log('New Attendance:', attendance);

    const date = new Date(attendance.created_at).toLocaleString();

    // insert new row to the top of the table and fix the numbering
    const table = $("#table-attendances");

    const element = `
        <tr>
            <th scope="row">1</th>
            <td>${attendance.peserta.nama}</td>
            <td>${attendance.peserta.nim}</td>
            <td>${date}</td>
        </tr>
    `;

    table.find('tbody').prepend(element);

    table.find('tbody tr').each((i, el) => {
        $(el).find('th').text(i + 1);
    });
});

socket.on('disconnect', () => {
    console.log('Disconnected from the WebSocket server');
});