// Abrindo e fechando o menu lateral
$('.btn-menu').click(function(){
    if($('.lateral-sidebar').css('display') == 'block'){
        $('.sidebar').animate({
            'width': '0%',
        });

        $('.lateral-sidebar').fadeOut(500)

        $('.btn-menu').animate({
            'left':'4%'
        })

    } else if($('.lateral-sidebar').css('display') == 'none') {
        $('.lateral-sidebar').fadeIn(500)

        $('.sidebar').animate({
            'width':'20%'
        })

        $('.btn-menu').animate({
            'left':'23%'
        })

    }
})
/*****/