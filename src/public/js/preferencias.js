$("#config-theme-select").change(function(e) {
    $.ajax({
        type: "POST",
        url: "/configuracion",
        data: { theme: $("#config-theme-select").val() },
        success: () => window.location.href = "/configuracion"
    });
});