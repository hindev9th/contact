const menhList = ['Kim', 'Thủy', 'Hỏa', 'Thổ', 'Mộc'];
// Form submit data
$('#form-data').submit(function (e) {
    e.preventDefault();
    $('#btn-send').attr('disabled', 'disabled');
    const formData = $(this).serializeArray();
    const fullName = `${formData[0].value} ${formData[1].value}`
    const date = moment(formData[2].value);
    const dateDuong = date.format('DD-MM-YYYY');
    const dateAm = date.lunar();
    const dateAmFormat = dateAm.format("DD-MM-YYYY");

    const menh = timMenh(parseInt(dateAm.format('YYYY')));

    $('#tt-ho').text(formData[0].value);
    $('#tt-ten').text(formData[1].value);
    $('#tt-fullname').text(fullName);
    $('#tt-ngay-sinh-duong').text(dateDuong);
    $('#tt-ngay-sinh-am').text(dateAmFormat);
    $('#tt-menh').text(menh);
    $('#tt-sdt').text(formData[3].value);
    $('#tt-email').text(formData[4].value);
    $('#tt-title').text(formData[5].value);
    $('#tt-content').text(formData[6].value);

    getData(formData).then(datas => {
        showData(datas, formData[2].value, menh);
        $('#btn-send').removeAttr('disabled');
    })

});
// Lấy Năm âm lịch
const getYearAm = (date) => {
    const dateCr = moment(date);
    const dataAm = dateCr.lunar();
    return parseInt(dataAm.format('YYYY'));
}
// Tìm mệnh
const timMenh = (year) => {
    const can = year % 10;
    const chi = year % 12;
    let menhIndex = timCan(can) + timChi(chi);
    if (menhIndex > 5) { menhIndex = menhIndex - 5 };

    return menhList[menhIndex - 1];
}
// Tìm Can
const timCan = (can) => {
    if (can === 4 || can === 5) {
        return 1;
    }
    if (can === 6 || can === 7) {
        return 2;
    }
    if (can === 8 || can === 9) {
        return 3;
    }
    if (can === 0 || can === 1) {
        return 4;
    }
    if (can === 2 || can === 3) {
        return 5;
    }
    return can
}
// Tìm Chi
const timChi = (chi) => {
    if (chi === 4 || chi === 5 || chi === 10 || chi === 11) {
        return 0;
    }
    if (chi === 6 || chi === 7 || chi === 0 || chi === 1) {
        return 1;
    }
    if (chi === 8 || chi === 9 || chi === 2 || chi === 3) {
        return 2;
    }

    return chi
}
// Post dữ liệu lên địa chỉ https://boiduong.online/test.php
const getData = async (formData) => {
    return await $.ajax({
        type: 'post',
        url: 'https://proxy.cors.sh/https://boiduong.online/test.php',
        data: formData,
        dataType: 'json',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'x-cors-api-key': 'temp_94696ed84e5821270083d01352af4cd2',
        },
    });
}
// Hiển thị dữ liệu ra trang web
const showData = (datas, date, menh) => {
    const dateD = moment(date);
    const yearD = parseInt(dateD.format('YYYY'));
    const monthD = parseInt(dateD.format('MM'));
    const hopMenhList = [];
    const cungThangList = [];
    const cungQuyList = [];
    const cungNamList = [];

    const boxHM = $('#list-hm');
    const boxCT = $('#list-ct');
    const boxCQ = $('#list-cq');
    const boxCN = $('#list-cn');

    boxHM.empty();
    boxCT.empty();
    boxCQ.empty();
    boxCN.empty();

    // get data
    for (let i in datas) {
        if (hopMenh(datas[i].birthday, menh)) {
            hopMenhList.push(datas[i]);
        }
        if (cungThang(datas[i].birthday, monthD)) {
            cungThangList.push(datas[i]);
        }
        if (cungQuy(datas[i].birthday, monthD)) {
            cungQuyList.push(datas[i]);
        }
        if (cungNam(datas[i].birthday, yearD)) {
            cungNamList.push(datas[i]);
        }
    }

    // show data to html
    for (let i in hopMenhList) {
        boxHM.append(`<li><strong>${hopMenhList[i].fullName}</strong><span>${moment(hopMenhList[i].birthday).format('DD-MM-YYYY')}</span</li>`);
    }

    for (let i in cungThangList) {
        boxCT.append(`<li><strong>${cungThangList[i].fullName}</strong><span>${moment(cungThangList[i].birthday).format('DD-MM-YYYY')}</span</li>`);
    }

    for (let i in cungQuyList) {
        boxCQ.append(`<li><strong>${cungQuyList[i].fullName}</strong><span>${moment(cungQuyList[i].birthday).format('DD-MM-YYYY')}</span</li>`);
    }

    for (let i in cungNamList) {
        boxCN.append(`<li><strong>${cungNamList[i].fullName}</strong><span>${moment(cungNamList[i].birthday).format('DD-MM-YYYY')}</span</li>`);
    }
}
// Tìm người hợp mệnh
const hopMenh = (birthday, menh) => {
    const menhTemp = timMenh(getYearAm(birthday));
    if (menh === menhList[0]) {
        return menhTemp === "Thổ" || menhTemp === "Thủy";
    }
    if (menh === menhList[1]) {
        return menhTemp === "Kim" || menhTemp === "Mộc";
    }
    if (menh === menhList[2]) {
        return menhTemp === "Thổ" || menhTemp === "Mộc";
    }
    if (menh === menhList[3]) {
        return menhTemp === "Hỏa" || menhTemp === "Kim";
    }
    if (menh === menhList[4]) {
        return menhTemp === "Hỏa" || menhTemp === "Thủy";
    }
    return false;
}
// Tìm người cùng tháng
const cungThang = (birthday, month) => {
    const date = moment(birthday);
    const monthTemp = parseInt(date.format('MM'));
    return month === monthTemp;
}
// Tìm người cùng quý
const cungQuy = (birthday, month) => {
    const date = moment(birthday);
    const monthTemp = parseInt(date.format('MM'));
    if (month >= 1 && month <= 3 && monthTemp >= 1 && monthTemp <= 3) {
        return true;
    }
    if (month >= 4 && month <= 6 && monthTemp >= 4 && monthTemp <= 6) {
        return true;
    }
    if (month >= 7 && month <= 9 && monthTemp >= 7 && monthTemp <= 9) {
        return true;
    }
    if (month >= 10 && month <= 12 && monthTemp >= 10 && monthTemp <= 12) {
        return true;
    }
    return false;
}
// Tìm người sinh cùng năm
const cungNam = (birthday, year) => {
    const date = moment(birthday);
    const yearTemp = parseInt(date.format('YYYY'));
    return year === yearTemp
}