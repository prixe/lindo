jQuery(".labico-plus-square-o").on("click",function(){
    setTimeout(function(){
      console.log("trigger");
    jQuery("#edit-value-hours").parent().find(".bootstrap-touchspin-up").find("i").trigger("mousedown");setTimeout(function(){jQuery("#edit-value-minutes").parent().find(".bootstrap-touchspin-up").find("i").trigger("mousedown");},500);setTimeout(function(){  jQuery("#edit-projects").multiselect("select","33"); jQuery("#edit-projects").trigger("change") ;setTimeout(function(){ jQuery("#edit-idtaskcategory").multiselect("select","27"); jQuery("#edit-idtaskcategory").trigger("change"); },2000);},1000);
    
    },500);
    })
    