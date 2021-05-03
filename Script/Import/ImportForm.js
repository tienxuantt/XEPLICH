// Form nhập khẩu
class ImportForm{

    // Hàm khởi tạo
    constructor(jsCaller, idForm){
        this.form = $(idForm);
        this.jsCaller = jsCaller;

        this.initEvent();
    }

    // Khởi tạo các sự kiện
    initEvent(){
        let me = this;

        me.form.draggable();

        me.form.find(".btn-save").off("click");
        me.form.find(".btn-cancel").off("click");
        me.form.find(".download-file").off("click");
        
        me.form.find(".btn-save").on("click",me.save.bind(me));
        me.form.find(".btn-cancel").on("click",me.close.bind(me));
        me.form.find(".download-file").on("click", me.downloadFile.bind(me));

        me.form.find('input[type="file"]').change(function(e){
            var fileName = e.target.files[0].name;

            if(!(fileName.endsWith(".xlsx") || fileName.endsWith(".xls") || fileName.endsWith(".csv"))){
                me.form.find(".file-name").text("Vui lòng chọn file excel!");
                me.form.find(".btn-save").addClass("disable-button");
            }else{
                me.form.find(".file-name").text(fileName);
                me.form.find(".btn-save").removeClass("disable-button");
            }
        });
    }

    //Hàm dùng tải file mẫu về
    downloadFile(){
        let me = this,
            entityName = me.jsCaller.config.entityName,
            url = mappingApi[entityName].urlDownloadFileTemplate,
            fileName = Enum.FileName[entityName].FileNameExport;

            if(url){
                let  xhr = new XMLHttpRequest();

                xhr.responseType = 'blob';
                xhr.withCredentials = true;
                xhr.open("GET", url);

                var authorization = localStorage.getItem("Authorization");
                    xhr.setRequestHeader("Authorization", authorization);

                xhr.onreadystatechange = function() {
                    if(xhr.readyState == 4 && xhr.status == 200) {
                        var downloadLink = window.document.createElement('a');
                            var URL = window.URL || window.webkitURL;
                            downloadLink.href = URL.createObjectURL(new Blob([xhr.response], { type: "application/vnd.ms-excel" }));
                            downloadLink.download = fileName;
                            document.body.appendChild(downloadLink);
                            downloadLink.click();
                            document.body.removeChild(downloadLink);
                    }
                }

                xhr.send();
            }
    }
    
    // Cất dữ liệu
    save(){
        let me = this,
            data = me.getSubmitData();

        if(data){
            me.saveChangeData(data); 
            me.close();
        }
    }

    // Lấy dữ liệu file
    getSubmitData(){
        let me = this,
            inputFile = me.form.find('input[type="file"]')[0];
        
        let data = new FormData();
            data.append("file", inputFile.files[0]);
        
        return data;
    }

    // Lưu dữ liệu vào DB
    saveChangeData(data){
        let me = this,
            entityName = me.jsCaller.config.entityName,
            url = mappingApi[entityName].urlUploadFile,
            fileName = Enum.FileName[entityName].FileNameError,
            fileType = "application/vnd.ms-excel";

        // Custom lại tùy vào từng màn hình
        url = me.getCustomUrlImport(url);

        if(data && url){

            $(".grid-wrapper").addClass("loading");

            var xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.withCredentials = true;
                xhr.open("POST", url);

            var authorization = localStorage.getItem("Authorization");
                xhr.setRequestHeader("Authorization", authorization);

                xhr.onreadystatechange = function() {
                    if(xhr.readyState == 4 && xhr.status == 200) {
                        if(xhr.response.type == fileType){
                            var downloadLink = window.document.createElement('a');
                            var URL = window.URL || window.webkitURL;
                            downloadLink.href = URL.createObjectURL(new Blob([xhr.response], { type: fileType }));
                            downloadLink.download = fileName;
                            document.body.appendChild(downloadLink);
                            downloadLink.click();
                            document.body.removeChild(downloadLink);
                        }else{
                            me.showMessageSuccess("Nhập khẩu dữ liệu thành công");
                        }
                        
                        me.jsCaller.loadAjaxData();
                    }
                }
            
                xhr.send(data);
        }
    }

    // Xuất khẩu dữ liệu
    exportData(){
        let me = this,
            entityName = me.jsCaller.config.entityName,
            url = mappingApi[entityName].urlExport,
            fileName = Enum.FileName[entityName].FileNameExport;

        // Custom lại tùy vào từng màn hình
        url = me.getCustomUrlExport(url);

        if(url){
            let  xhr = new XMLHttpRequest();

            xhr.responseType = 'blob';
            xhr.withCredentials = true;
            xhr.open("GET", url);

            var authorization = localStorage.getItem("Authorization");
                xhr.setRequestHeader("Authorization", authorization);

            xhr.onreadystatechange = function() {
                if(xhr.readyState == 4 && xhr.status == 200) {
                    var downloadLink = window.document.createElement('a');
                        var URL = window.URL || window.webkitURL;
                        downloadLink.href = URL.createObjectURL(new Blob([xhr.response], { type: "application/vnd.ms-excel" }));
                        downloadLink.download = fileName;
                        document.body.appendChild(downloadLink);
                        downloadLink.click();
                        document.body.removeChild(downloadLink);
                }
            }

            xhr.send();
        }
    }

    // Custom lại url tùy từng màn hình
    getCustomUrlExport(url){
        let me = this,
            entityName = me.jsCaller.config.entityName;

        switch(entityName){
            case "StudentSubjects":
            case "ExamRegisterResultDetail":
                let masterId = me.jsCaller.masterData.Id;
                url = url.format(masterId);
                break;
            case "RoomSetting":
            case "CreateExams":
            case "ExamRegisterResult":
                let semesterId = parseInt(localStorage.getItem("SemesterId"));
                    url = url.format(semesterId);
                break;
            default:
                return url;
        }

        return url;
    }

    // Custom lại url tùy từng màn hình
    getCustomUrlImport(url){
        let me = this,
            entityName = me.jsCaller.config.entityName;

        switch(entityName){
            case "StudentSubjects":
                let masterId = me.jsCaller.masterData.Id;
                url = url.format(masterId);
                break;
            default:
                return url;
        }

        return url;
    }

    // Hiển thị thông báo cất thành công
    showMessageSuccess(customMessage){
        let message = customMessage || "Cất dữ liệu thành công!";

        $("#success-alert strong").text(message);

        $("#success-alert").fadeTo(1500, 500).slideUp(500, function(){
            $("#success-alert").slideUp(500);
        });
    }

    // Hàm hiển thị form
    show(){
        this.form.parent().show();
    }

    // Đóng form
    close(){
        this.resetFormData();
        $(".wrapper-form").hide();
    }

    // Xóa dữ liệu form
    resetFormData(){
        this.form.find(".file-name").text("");
        this.form.find('input[type="file"]').val(null);
        this.form.find(".btn-save").addClass("disable-button");
    }
}