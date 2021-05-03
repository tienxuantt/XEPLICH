// Trang tạo lịch thi tự động
class CreateExamDetail {
    constructor(pageMaster) {
        this.pageMaster = pageMaster;

        this.listSubjects = [];
        this.listRooms = [];
        this.listRoomCache = [];
        this.listTimeCache = [];
        this.listSubjectConflic = [];
        this.periodFocusNow = 0;

        this.initEvent();
    }

    // Khởi tạo các sự kiện
    initEvent() {
        let me = this;

        // Cho phép sắp xếp phòng thi
        $(".listRoom").sortable({
            update: function (event, ui) {
                me.updateCacheRoom();
                me.renderPeriod();
            }
        }).disableSelection();

        // Cho phép sắp xếp học phần
        $(".listSubject").sortable({
            update: function (event, ui) {
                me.updateCacheSubject();
                me.renderPeriod();
            }
        }).disableSelection();

        // Sự kiện khi bấm chuột xuống
        $(".item-rooms").mousedown(function () {
            $(".period-focus").removeClass("period-focus");
            $(this).addClass("period-focus");

            me.periodFocusNow = $(this).find(".period-sortable").data("indexPeriod");
            me.renderRooms();
        });

        // Sự kiện khi bấm vào icon mắt
        $(".comboSortable").on("click", ".icon-eye span", function () {
            let className = $(this).attr("class"),
                data = $(this).parents(".itemRoom").data("value"),
                isShow = true;

            if (className.indexOf("glyphicon-eye-open") != -1) {
                isShow = false;
            }

            let index = me.getIndexByID(data.RoomId, me.listRoomCache[me.periodFocusNow]);
            me.listRoomCache[me.periodFocusNow][index].IsShow = isShow;
            me.renderPeriod();
        });

        // Thay đổi giá trị phút
        me.setEventChangeMinusSubject();
        // Thay đổi giá trị ngày tháng
        me.setEventChangeTimePeriod();
    }

    // Thực hiện reset dữ liệu
    resetData(){
        let me = this;

        me.listSubjects = [];
        me.listRooms = [];
        me.listRoomCache = [];
        me.listTimeCache = [];
        me.periodFocusNow = 0;
    }

    // Thay đổi giá trị phút
    setEventChangeMinusSubject(){
        let me = this;

        $(".listSubject").on("blur", "input",function(){
            let value = $(this).val(),
                index = $(this).data("index"),
                valuePre = me.listSubjects[index].Minus,
                realValue = TryParseInt(value, valuePre);

                me.listSubjects[index].Minus = realValue;
                $(this).val(realValue);

            me.renderPeriod();
        });
    }

    // Thay đổi hàng loạt thời gian
    changeAllValueMinus(){
        let me = this;

        $(".content-header input").each(function(index, va){
            let value = $(this).val(),
                minutes = me.getMaximunMinus(index),
                valuePre = me.listTimeCache[index].StartTime;

                if(value){
                    me.listTimeCache[index].StartTime = value;
                    me.listTimeCache[index].EndTime = addMinutes(value, minutes);
                    $(this).parent().next().find(".endtime").text(me.listTimeCache[index].EndTime);
                }else{
                    $(this).val(valuePre);
                }
        });
    }

    // Thay đổi giá trị ngày tháng
    setEventChangeTimePeriod(){
        let me = this;

        $(".content-header").on("change", "input",function(){
            let value = $(this).val(),
                index = $(this).data("index"),
                minutes = me.getMaximunMinus(index),
                valuePre = me.listTimeCache[index].StartTime;

                if(value){
                    me.listTimeCache[index].StartTime = value;
                    me.listTimeCache[index].EndTime = addMinutes(value, minutes);
                    $(this).parent().next().find(".endtime").text(me.listTimeCache[index].EndTime);
                }else{
                    $(this).val(valuePre);
                }
        });
    }

    // Chạy hàm sau khi load xong dữ liệu
    executeBeforeLoadAjax(){
        let me = this;

        me.createCacheList();
        me.updateColorSubject();
        me.renderSubject();
        me.renderPeriod();
    }

    // Lấy dữ liệu học phần và phòng thi
    buildListDataCache(){
        let me = this,
            semesterId = parseInt(localStorage.getItem("SemesterId")),
            urlDetail = Constant.urlPaging.format(1000, 1),
            urlSubjects = mappingApi.SubjectSemesters.urlGetData.format(semesterId) + urlDetail,
            urlRooms = mappingApi.RoomSetting.urlGetData.format(semesterId) + urlDetail;

        // Render danh sách học phần
        CommonFn.GetAjax(urlSubjects, function (response) {
            if(response.status == Enum.StatusResponse.Success){
                me.listSubjects =  response.data["SubjectSemesters"];
            }
        },false);

        // Render danh sách phòng thi
        CommonFn.GetAjax(urlRooms, function (response) {
            if(response.status == Enum.StatusResponse.Success){
                me.listRooms = response.data["RoomSemesters"];
            }
        },false);

        // Convert dữ liệu
        me.convertData();
    }

    // Thực hiện chuyển đổi dữ liệu
    convertData(){
        let me = this,
            listSub = [],
            listRoom = [];

        // Convert danh sách học phần
        me.listSubjects.filter(function(item, index){
            let obj = {
                SubjectID: item.Id,
                SubjectName: item.SubjectName,
                SubjectCode: item.SubjectCode,
                NumberStudent: item.NumberStudent,
                SortOrder: index,
                Color: null,
                Minus: 60
            };

            listSub.push(obj);
        });

        // Convert danh sách phòng thi
        me.listRooms.filter(function(item, index){
            let obj = {
                RoomId: item.Id,
                RoomName: item.RoomName,
                Location: item.Location,
                NumberComputer: item.NumberOfComputer,
                NumberStudent: 0,
                SortOrder: index,
                IsShow: true
            };

            listRoom.push(obj);
        });

        me.listSubjects = listSub;
        me.listRooms = listRoom;
    }

    // load dữ liệu từ DB
    loadAjaxData() {
        let me = this;

        me.buildListDataCache();
        me.executeBeforeLoadAjax();
    }
    
    // Hiển thị trang detail
    show() {
        let me = this;

        me.getSubjectConflic();
        me.loadAjaxData();
    }

    // Lấy các môn học bị conflic
    getSubjectConflic(){
        let me = this,
            semesterId = parseInt(localStorage.getItem("SemesterId")),
            url = mappingApi.CreateExams.urlGetConflic.format(semesterId);

        if(semesterId){
             // Lấy danh sách học phần bị conflic
            CommonFn.GetAjax(url, function (response) {
                if(response.status == Enum.StatusResponse.Success){
                    me.listSubjectConflic = response.data;
                }
            },false);
        }
    }

    // Kiểm tra có bị conflic hàng loạt không
    checkConflicListSubject(listData, subjectId){
        let me = this,
            conflic = false;

        listData.filter(function(item){
            if(me.checkConflicSubject(item, subjectId)){
                conflic = true;
            }
        });

        return conflic;
    }

    // Kiểm tra hai học phần có bị conflic không
    checkConflicSubject(subjectId1, subjectId2){
        let me = this,
            listData = me.listSubjectConflic,
            isConflic = false;

        for(let i = 0; i < listData.length; i++){
            if(subjectId1 == listData[i].SubjectId && listData[i].SubjectConflict.includes(subjectId2)){
                isConflic = true;
                break;
            }
        }

        return isConflic;
    }

    // Cất dữ liệu
    save() {
        let me = this,
            isValid = me.validateBeforeSave();

        if(isValid){
            me.doSaveData();
        }
    }

    // Thực hiện cất dữ liệu
    doSaveData(){
        let me = this,
            data = me.geSubmitData();

        if(data.length > 0){
            let semesterId = parseInt(localStorage.getItem("SemesterId")),
                url = mappingApi.CreateExams.urlCreate.format(semesterId);

                CommonFn.PostPutAjax("POST",url, data, function(response) {
                    if(response.status == Enum.StatusResponse.Success){
                        me.showMessageSuccess("Cất dữ liệu thành công");
                    }
                });
        }
    }

    // Lấy dữ liệu trước khi lưu
    geSubmitData(){
        let me = this,
            listDataSubmit = [];

        $(".content-header .item-number").each(function(inde, val){
            let sumStudent = $(this).data("sumStudent"),
                room = $(this).data("room"),
                subject = $(this).data("subject"),
                indexPeriod =  $(this).data("indexPeriod");

            if(sumStudent){
                let obj = {
                    NumberOfStudent: sumStudent,
                    StartTime: me.listTimeCache[indexPeriod].StartTime,
                    EndTime: me.listTimeCache[indexPeriod].EndTime,
                    SubjectSemesterId: subject.SubjectID,
                    RoomSemesterId: room.RoomId,
                    Date: me.listTimeCache[indexPeriod].StartTime.substr(0,10)
                };

                listDataSubmit.push(obj);
            }
        });

        return listDataSubmit;
    }

    // Hàm sau khi save thành công
    affterSaveCallBack(){
        let me = this.pageMaster;

        $("[Layout='Master']").show();
        $("[Layout='Detail']").hide();
        me.editMode = Enum.EditMode.View;
        me.setStatusToolbar();
        me.loadAjaxData();
    }

    // Cập nhật các phòng thi
    updateCacheRoom() {
        let dataArr = [],
            me = this;

        $(".listRoom .itemRoom").each(function (index, item) {
            let dataRow = $(this).data("value");
            dataRow.SortOrder = index + 1;
            dataArr.push(dataRow);
            $(this).data("value", dataRow);
        });

        me.listRoomCache[me.periodFocusNow] = dataArr;
    }

    // Render các ca thi
    renderPeriod() {
        let me = this,
            listSubjects = me.listSubjects,
            sumPeriod = listSubjects.length * 2;

        me.renderPeriodBlank(sumPeriod);
        me.fillStudentInPeriod();
        me.changeAllValueMinus();
    }

    // Render các phòng rỗng
    renderPeriodBlank(sumPeriod) {
        let me = this,
            listRoomCache = me.listRoomCache,
            periodFocusNow = me.periodFocusNow;

        $(".content-header").html("");

        for (var i = 0; i < sumPeriod; i++) {
            let element = $(".period-clone .item-rooms").clone(true);

            listRoomCache[i].filter(function (item, indexBox) {
                if (item.IsShow) {
                    let elementBox = $("<li class='backgound-brown item-number'><span class='numberReal'></span><span class='numberBlank'></span></li>");
                    elementBox.find(".numberBlank").text(item.NumberComputer);
                    elementBox.find(".numberReal").text(0);
                    elementBox.data("room", item);
                    elementBox.data("indexPeriod", i);
                    elementBox.data("indexBox", indexBox);
                    element.find(".item-period").append(elementBox);
                }else{
                    item.SubjectName = "";
                    item.NumberStudent = 0;
                }
            });

            element.find(".item-period").data("indexPeriod", i);
            element.find(".settingTime").data("indexPeriod", i);
            element.find(".periodNumber").text(i + 1);
            element.find("input").attr("class","datetimepicker classDatepicker" + (i + 1));
            element.find("input").data("index", i);

            $(".content-header").append(element);

            // Tạo datetime picker cho input ngày tháng
            $(".classDatepicker" + (i + 1)).datetimepicker({
                format:'d/m/Y H:i',
                defaultTime:'07:00',
                step:30,
                timeFormat: 'HH:mm'
            });
        }

        $(".content-header .item-rooms").eq(periodFocusNow).addClass("period-focus");
    }

    // Điền đầy đủ sinh viên vào từng phòng
    fillStudentInPeriod() {
        let index = 0,
            me = this,
            listSubjects = me.listSubjects,
            elementBoxs = $(".content-header .item-number"),
            periodCurrent = 0,
            subjectCurrent = 0,
            listSubjectId = [];

        me.resetRooms();

        listSubjects.filter(function (subject, subjectIndex) {
            var numberStudent = subject.NumberStudent,
                sumBox = 0;

            for (var j = index; j < elementBoxs.length; j++) {
                let numberComputer = parseInt($(elementBoxs[j]).find(".numberBlank").text()),
                    indexBox = $(elementBoxs[j]).data("indexBox"),
                    indexPeriod = $(elementBoxs[j]).data("indexPeriod");

                if(subjectIndex > 0 && indexPeriod == periodCurrent && subjectIndex != subjectCurrent && me.checkConflicListSubject(listSubjectId, subject.SubjectID)){
                    index++;
                }else{
                    me.listRoomCache[indexPeriod][indexBox].SubjectName = subject.SubjectName;

                    sumBox += numberComputer;
    
                    $(elementBoxs[j]).css("background-color", subject.Color);
                    $(elementBoxs[j]).data("subject", subject);
                    $(elementBoxs[j]).data("subjectIndex", subjectIndex);
                    
                    index++;
    
                    if(periodCurrent == indexPeriod && !listSubjectId.includes(subject.SubjectID)){
                        listSubjectId.push(subject.SubjectID);
                    }else if (periodCurrent != indexPeriod){
                        listSubjectId = [subject.SubjectID];
                    }

                    periodCurrent = indexPeriod;
                    subjectCurrent = subjectIndex;

                    if (sumBox >= numberStudent) {
                        $(elementBoxs[j]).data("sumStudent",numberComputer - (sumBox - numberStudent));
                        $(elementBoxs[j]).find(".numberReal").text(numberComputer - (sumBox - numberStudent));
                        me.listRoomCache[indexPeriod][indexBox].NumberStudent = numberComputer - (sumBox - numberStudent);
                        break;
                    }else{
                        $(elementBoxs[j]).data("sumStudent",numberComputer);
                        $(elementBoxs[j]).find(".numberReal").text(numberComputer);
                        me.listRoomCache[indexPeriod][indexBox].NumberStudent = numberComputer;
                    }
                }
            }
        });

        // Render các ngày tháng
        me.renderTimeExam();
        // ẩn bớt các ca thi không dùng tới
        me.hideRoomNotUse();
        // Render lại các phòng thi
        me.renderRooms();
    }

    // ẩn những ca không cần thiết
    hideRoomNotUse(){
        let me = this;

        $(".content-header .item-rooms").each(function(index, value){
            let itemRoom = $(this).find(".item-number").eq(0),
                data = itemRoom.data("subject");

            if(!data){
                $(this).hide();
            }
        });

    }

    // Render các ngày tháng
    renderTimeExam(){
        let me = this,
            listTime = me.listTimeCache;

        $(".content-header .settingTime").each(function(index, element){
            $(this).find(".datetimepicker").val(listTime[index].StartTime);
            $(this).find(".endtime").text(listTime[index].EndTime);
        });
    }

    // Reset lại phòng thi cho từng ca
    resetRooms(){
        let me = this;

        for(let i = 0; i < me.listRoomCache.length; i++){
            for(let j = 0; j < me.listRoomCache[i].length ; j++){
                me.listRoomCache[i][j].SubjectName = "";
                me.listRoomCache[i][j].NumberStudent = 0;
            }
        }
    }

    // Render danh sách các phòng thi
    renderRooms() {
        let me = this,
            listRoomCache = me.listRoomCache,
            periodFocusNow = me.periodFocusNow,
            listRooms = listRoomCache[periodFocusNow];

        $(".listRoom").html("");

        listRooms.filter(function (item) {
            let element = $(".room-clone .itemRoom").clone(true);

            element.find(".item-name").text(item.RoomName);
            element.find(".item-location").text(item.Location);
            element.find(".item-subject").text(item.SubjectName);
            element.find(".computer").text(item.NumberComputer);
            element.find(".sv").text(item.NumberStudent);
            element.data("value", item);

            if (!item.IsShow) {
                element.find(".glyphicon").attr("class", "glyphicon glyphicon-eye-close");
                element.find(".glyphicon").parents(".itemRoom").addClass("disable-item");
            }

            $(".listRoom").append(element);
        });
    }

    // Render danh sách các học phần
    renderSubject() {
        let me = this,
            listSubjects = me.listSubjects;

        $(".listSubject").html("");

        listSubjects.filter(function (item, index) {
            let element = $(".subject-clone .itemSubject").clone(true);

            element.find(".item-name").text(item.SubjectName);
            element.find(".item-code").text(item.SubjectCode);
            element.find(".item-count").text(item.NumberStudent);
            element.find(".numberMinus").val(item.Minus);
            element.find(".square-color").css("background-color", item.Color);

            element.data("value", item);
            element.find("input").data("index", index);

            $(".listSubject").append(element);
        });
    }

    // Kiểm tra hai khoảng thời gian xem có bị giao nhau không
    checkValidTwoDateRange(Range1, Range2){
        let start1 = convertDate(Range1.StartTime),
            end1 = convertDate(Range1.EndTime),
            start2 = convertDate(Range2.StartTime),
            end2 = convertDate(Range2.EndTime);

        if(start1 > end2 || end1 < start2){
            return true;
        }

        return false;
    }

    // Validate trước khi cất
    validateBeforeSave(){
        let me = this,
            isValid = me.validateSubject(); // Validate học phần

        if(isValid){
            isValid = me.validateTime(); // Validate thời gian
        }

        if(isValid){
            isValid = me.validateDateRequire(); // Validate thời gian cần nhập đủ
        }

        if(isValid){
            isValid = me.validateTimeRange(); // Validate khoảng thời gian cần hợp lệ
        }

        return isValid;
    }

    // Validate list time
    validateTimeRange(){
        let me = this,
            isValid = true,
            check = true,
            length = me.getSumPeriodReal();

        for(var i = 0; i < length - 1; i++){
            for(var j = i + 1; j < length; j++){
                check = me.checkValidTwoDateRange(me.listTimeCache[i], me.listTimeCache[j]);

                if(check == false){
                    isValid = false;
                    me.showMessageError("Thời gian không hợp lệ!");
                    break;
                }
            }
        }

        return isValid;
    }

    // Lấy số ca thi thực thế
    getSumPeriodReal(){
        let me = this,
            sum = 0;

        $(".content-header .item-rooms").each(function(index, value){
            let itemRoom = $(this).find(".item-number").eq(0),
                data = itemRoom.data("subject");

            if(data){
                sum++;
            }
        });

        return sum;
    }

    // Validate cần phải thiết lập thời gian
    validateTime(){
        let me = this,
            isValid = true;

        if(me.listTimeCache[0].StartTime == ""){
            isValid = false;
            me.showMessageError("Vui lòng thiết lập thời gian!");
        }

        return isValid;
    }

    // Validate học phần
    validateSubject(){
        let me = this,
            isValid = true;

        if(me.listSubjects.length == 0){
            isValid = false;
            me.showMessageError("Không có học phần nào cho kì thi!");
        }

        return isValid;
    }

    // Hiển thị thông báo cất thành công
    showMessageSuccess(customMessage){
        let message = customMessage || "Cất dữ liệu thành công!";

        $("#success-alert strong").text(message);

        $("#success-alert").fadeTo(2500, 800).slideUp(800, function(){
            $("#success-alert").slideUp(800);
        });
    }

    // Hiển thị thông báo cất thành công
    showMessageError(customMessage){
        let message = customMessage || "Đã có lỗi xảy ra!";

        $("#error-alert strong").text(message);

        $("#error-alert").fadeTo(2500, 800).slideUp(800, function(){
            $("#error-alert").slideUp(800);
        });
    }

    // Validate các thông tin thời gian
    validateDateRequire(){
        let me = this,
            isValid = true;

        $(".content-header .item-rooms").each(function(index, value){
            let itemRoom = $(this).find(".item-number").eq(0),
                data = itemRoom.data("subject");

            if(data){
                let val = $(this).find("input").val();
                if(!val){
                    isValid = false;
                    me.showMessageError("Vui lòng điền đầy đủ thời gian!");
                }
            }
        });

        return isValid;
    }

    // Hàm lấy số phút tối đa
    getMaximunMinus(index){
        let me = this,
            maxValue = 0;

        $(".content-header .item-period").eq(index).find(".item-number").each(function(indexItem, value){
            let subjectIndex = $(this).data("subjectIndex");

            if(subjectIndex != null){
                let valueMinus = me.listSubjects[subjectIndex].Minus;

                if(valueMinus > maxValue){
                    maxValue = valueMinus;
                }
            }
        });

        return maxValue;
    }

    // Cập nhật cache học phần
    updateCacheSubject(){
        let me = this,
            dataArr = [];
    
        $(".listSubject .itemSubject").each(function(index, item){
            let dataRow = $(this).data("value");
            dataRow.SortOrder = index + 1;
            dataArr.push(dataRow);
            $(this).data("value", dataRow);
            $(this).find("input").data("index", index);
        });
    
        me.listSubjects = dataArr;
    }

    // Tạo cache lưu phòng
    createCacheList(){
        let me = this,
            listRooms = me.listRooms;

        me.listRoomCache = [];
    
        for(var i = 0; i <= me.listSubjects.length * 2 ; i++){
            var obj = JSON.parse(JSON.stringify(listRooms)),
                objTime = {
                    StartTime: "",
                    EndTime: ""
                };
            
            me.listTimeCache.push(objTime);
            me.listRoomCache.push(obj);
        }
    }

    // Lấy object theo ID
    getIndexByID(ID, list){
        let index = 0;
    
        for(var i = 0; i < list.length; i++){
            if(list[i].RoomId == ID){
                index = i;
                break;
            }
        }
        
        return index;
    }

    // Hàm cập nhật màu sắc cho học phần
    updateColorSubject(){
        let me = this;

        me.listSubjects = me.listSubjects.filter(function(item, index){
            if(index >= 10){
                item.Color = getRandomColor();
            }else{
                item.Color = listCorlor[index];
            }
           
            return item;
        });
    }

}