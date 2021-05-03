//////////////////////// Các hàm chung //////////////////////////////
// Hàm dùng để parse dữ liệu từ Jwt sang json
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

// Hàm dùng để chuyển một chuỗi Date dạng dd/MM/yyyy sang Date object
function convertDate(dateStr){
    let day = dateStr.substr(0,2),
        month = dateStr.substr(3,2),
        year = dateStr.substr(6,4),
        time = dateStr.substr(10,6),
        newDateStr = year + '-' + month + '-' + day + time;

    return new Date(newDateStr);
}

// Tính tổng một mảng theo tham số
function sumArrObject(arr, propName) {
    let value = 0;

    arr.filter(function(item){
        value += item[propName];
    });
    
    return value;
}

// Thêm thời gian một khoảng
function addMinutes(dateStr, number){
    var date = convertDate(dateStr);

    date.setMinutes(date.getMinutes() + number); 

    let year = date.getFullYear(),
        month = formatNumber(date.getMonth() + 1),
        day = formatNumber(date.getDate()),
        hour = formatNumber(date.getHours()),
        min = formatNumber(date.getMinutes());

    return day + "/" + month + "/" + year + " " + hour + ":" + min;
}

// Parse dữ liệu từ chuỗi sang số
function TryParseInt(str, defaultValue) {
    var retValue = defaultValue;

    if(str !== null) {
        if(str.length > 0) {
            if (!isNaN(str)) {
                retValue = parseInt(str);
            }
        }
    }

    return retValue > 0 ? retValue : defaultValue;
}

// Lấy màu ngẫu nhiên
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Format number
function formatNumber(number){
    return number < 10 ? ('0' + number) : number;
}

// Hàm dùng để chuyển một chuỗi sang định dạng picker
function convertDateToPicker(dateStr){
    let me = this,
        hour = parseInt(dateStr.substr(0,2)),
        min = parseInt(dateStr.substr(3,2)),
        type = 'AM'

        if(hour > 12){
            hour = hour - 12;
            type = 'PM';
        }

    return formatNumber(hour) + ':' + formatNumber(min) + ' ' + type;
}

// Convert từ chuỗi 04:04 PM sang 16:04
function convertTimepicker(dateStr){
    let hour = parseInt(dateStr.substr(0,2)),
        min = parseInt(dateStr.substr(3,2)),
        type = dateStr.substr(6,2);

    if(type == 'PM'){
        hour = hour + 12;
    }

    return formatNumber(hour)  + ':' + formatNumber(min);
}

// Hàm dùng format chuỗi
String.prototype.format = function() {
    var args = arguments;

    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
};

var CommonFn = CommonFn || {};

// Clone một đối tượng này sang đối tượng mới
CommonFn.Clone = function(source){
    var destination = {};

    for(var fieldName in source){
        destination[fieldName] = source[fieldName];
    }

    return destination;
}

// Hàm dùng login
CommonFn.LoginAjax = function(param, fnCallBack){
    let url = mappingApi.Master.urlLogin;

    $.ajax({
        url: url,
        data: JSON.stringify(param),
        type: "POST",
        crossDomain: true,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (response) {
            fnCallBack(response);
        },
        error: function (errormessage) {
            console.log(errormessage.responseText);
        }
    });
}

// Ajax gọi phương thức get
CommonFn.GetAjax = function(url, fnCallBack, async = true){
    var authorization = localStorage.getItem("Authorization");

    if(authorization){
        $.ajax({
            url: url,
            type: "GET",
            async: async,
            headers: {
                "Content-Type": "application/json",
                "Authorization": authorization
            },
            crossDomain: true,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (response) {
                fnCallBack(response);
            },
            error: function (errormessage) {
                console.log(errormessage.responseText);
            }
        });
    }else{
        window.location.replace(Constant.url["Login"]);
    }
}

// ajax gọi phương thức post
CommonFn.PostPutAjax = function(type, url, param, fnCallBack, async = true){
    var authorization = localStorage.getItem("Authorization");

    if(authorization){
        $.ajax({
            url: url,
            data: JSON.stringify(param),
            async: async,
            type: type,
            headers: {
                "Content-Type": "application/json",
                "Authorization": authorization
            },
            crossDomain: true,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (response) {
                fnCallBack(response);
            },
            error: function (errormessage) {
                console.log(errormessage.responseText);
            }
        });
    }else{
        window.location.replace(Constant.url["Login"]);
    }
}

///////////////////////// Các hằng số ///////////////////////////////
var Constant = Constant || {};

// Các url để chuyển hướng
Constant.url = {
    Login: "file:///D:/KhoaLuan2020/Index.html",

    StudentManager: "file:///D:/KhoaLuan2020/View/StudentManager.html",
    SubjectManager: "file:///D:/KhoaLuan2020/View/SubjectManager.html",
    RoomManager:"file:///D:/KhoaLuan2020/View/RoomManager.html",
    SemesterManager: "file:///D:/KhoaLuan2020/View/SemesterManager.html",

    SubjectSemester: "file:///D:/KhoaLuan2020/View/SubjectSemester.html",
    SettingRoom: "file:///D:/KhoaLuan2020/View/RoomSetting.html",
    CreateExam: "file:///D:/KhoaLuan2020/View/CreateExam.html",
    ExamRegisterResult: "file:///D:/KhoaLuan2020/View/ExamRegisterResult.html"
}

// pagin phân trang
Constant.urlPaging = "?Size={0}&Page={1}";
Constant.urlPagingSearch = "?Query={0}&Size={1}&Page={2}";

///////////////////////// Các Enum //////////////////////////////////
var Enum = Enum || {};

// Enum các loại lỗi
Enum.TypeError = {
    RequireUserName: 0,
    RequirePassWord:1,
    LoginInvalid:2,
    RequireAll:3
}

// Các mode của thêm sửa xóa
Enum.EditMode = {
    Add: 1,
    Edit: 2,
    Delete: 3,
    View: 4
};

// Các trạng thái lỗi khi gọi ajax
Enum.StatusResponse = {
    Success: 200,
    NotFound: 404,
    BadRequest: 500,
    Exists: 409
}

// Enum giới tính
Enum.Gender = ["Giới tính","Nam","Nữ","Khác"];
Enum.Status = ["Trạng thái phòng thi","Sử dụng", "Không sử dụng"];
Enum.StatusStudent = ["Trạng thái sinh viên","", "Không"];
Enum.StatusPeriod = ["Trạng thái kì thi", "Chưa đăng ký", "Đang đăng ký", "Đã đăng ký"];

// Text thông báo lỗi
Enum.TypeErrorMessage = ["Tên đăng nhập không được để trống!","Mật khẩu không được để trống!","Tên đăng nhập hoặc mật khẩu không chính xác!",""];

// Danh sách các màu sắc random
var listCorlor = ["#23c6b6","#248f1a","#6d7ccd","#a44c5c","#0ed657","#b4ca98","#bbfcbb","#0fb4db","#93831d"];

// Các enum lưu lại tên file
Enum.FileName = {
    Students: {
        FileNameError: "Danh sách sinh viên không hợp lệ.xlsx",
        FileNameExport: "Danh sách sinh viên.xlsx"
    },
    Subjects: {
        FileNameError: "Danh sách học phần không hợp lệ.xlsx",
        FileNameExport: "Danh sách học phần.xlsx"
    },
    Rooms: {
        FileNameError: "Danh sách phòng thi không hợp lệ.xlsx",
        FileNameExport: "Danh sách phòng thi.xlsx"
    },
    StudentSubjects: {
        FileNameError: "Danh sách sinh viên không hợp lệ.xlsx",
        FileNameExport: "Danh sách sinh viên.xlsx"
    },
    RoomSetting:{
        FileNameExport: "Danh sách phòng thi.xlsx"
    },
    CreateExams:{
        FileNameExport: "Danh sách lịch thi.xlsx"
    },
    ExamRegisterResult:{
        FileNameExport: "Danh sách lịch thi.xlsx"
    },
    ExamRegisterResultDetail:{
        FileNameExport: "Danh sách sinh viên.xlsx"
    }
}

