// Objeto de acesso global
StarWarsQuiz = {};

(function() {
    var pub = StarWarsQuiz;

    // Objeto de acesso privado
    var priv = {};

    // Dados da Api Google api 1 
    const cx = '016116090092328954112:7z1-ybx3ks4';
    const key = 'AIzaSyAKAcUs5_LLPVgsk8GBQ0udUDH-iIUHLOo';

    // A Api do Google permite apenas 100 requisições por dia, logo criei duas contas para testar melhor
    // Dados da Api Google api 2  
    //const cx = '002459755808018872641:nwajtwppsm0';
    //const key = 'AIzaSyDCjhGjRHbolsrbnIuNtUQYEaatl7gEd10';

    const urlApi = 'https://swapi.co/api/';

    jQuery(function($) {

        $(document).ready(() => {


            priv.modalStart();

        })

        $(document).on('click', '.info', priv.modalDetails);
        $(document).on('click', '.close', priv.closeModal);

        $(document).on('click', '.close', priv.closeModal);
        $(document).on('click', '.closeStart', priv.startGame);
        $(document).on('click', '.prevPage', priv.previousP);
        $(document).on('click', '.nextPage', priv.nextP);
        $(document).on('click', '.responder', priv.modalAnswer);
        $(document).on('click', '.confirmarResposta', priv.confirmarResposta);
        $(document).on('click', '.saveWinner', priv.saveWinnerList);
        $(document).on('click', '.resetGame', priv.startAll);
        $(document).on('click', '.rankingWinners', priv.saveWinnerList);


    });

    // Funções do Jogo
    priv.carregaApi = (tipo, idItem, p) => {

        var api = urlApi + tipo + '/' + idItem;
        $.get(api, function(data) {
            var mountItem = $.map(data.results, function(item, i) {

                var url = item.url;

                var id = url.split(urlApi);
                id = id[1].split("/");
                item.id = id[1];

                if (tipo == 'people' || tipo == 'person') {
                    item.thumbnail = priv.searchImage(item.name);
                }

                return item;

            });

            switch (tipo) {
                case 'people':

                    if (idItem == '') {
                        priv.createPersonList(data, mountItem);
                    } else {
                        if (p) {
                            priv.createPersonList(data, mountItem);
                        } else {
                            priv.mountDetails(data);
                        }

                    }

                    break;
                case 'person':
                    priv.mountDetails(mountItem);
                    break;
                case 'species':
                    priv.mountSpecies(data);
                    break;
                case 'planets':
                    priv.mountPlanets(data);
                    break;
                case 'vehicles':
                    priv.mountVehicles(data);
                    break;
                case 'films':
                    priv.mountFilms(data);
                    break;
                case 6:
                    day = "Saturday";
            }

        });
    }

    priv.searchImage = (nome) => {
        var thumbnail;
        $.ajax({
            url: `https://www.googleapis.com/customsearch/v1?q=${nome}&cx=${cx}&key=${key}`,
            success: (result) => {
                thumbnail = result
                    .items[0]
                    .pagemap
                    .cse_thumbnail[0]
                    .src;
            },
            async: false
        });
        return thumbnail;
    }

    priv.createPersonList = (data, people) => {
        var gridPerson = $('#gridCardsPerson');
        var loading = $('#loading');

        gridPerson.html('');
        gridPerson.hide();
        loading.show();

        var card = '';

        $.each(people, function(i, person) {
            card = priv.createCard(person);
            gridPerson.append(card);
        })

        loading.hide();
        gridPerson.show();

        priv.updateNav(data.next, data.previous)
    }

    priv.updateNav = (next, prev) => {

        if (prev) {
            $("#prevPage").removeAttr("disabled");
            $("#prevPage").attr('linkP', prev);
        } else {
            $("#prevPage").attr('disabled', 'disabled');
        }

        if (next) {
            $("#nextPage").removeAttr("disabled");
            $("#nextPage").attr('linkN', next);
        } else {
            $("#nextPage").attr('disabled', 'disabled');
        }

    }

    priv.createCard = (person) => {

        var cardPerson = `  
        <div class="mdl-card mdl-cell mdl-cell--2-col mdl-cell--4-col-tablet mdl-shadow--2dp personagemCard animated rubberBand" pontos="10" >
        <figure class="mdl-card__media">
            <img src="${person.thumbnail}" alt="starWarsLoading" />
        </figure>     
        <div class="mdl-card__actions mdl-card--border ">
          <span class="responder${person.id}"> 
            <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect responder" idPerson="${person.id}" namePerson="${person.name}">Responder</a>
          </span>
        <div class="mdl-layout-spacer"></div>
        <button class="mdl-button mdl-button--icon mdl-button--colored info" idPerson="${person.id}" urlImage="${person.thumbnail}"><i class="material-icons" id="informacao" >info</i></button>
        <div class="mdl-tooltip" data-mdl-for="informacao">
        Clique para saber mais sobre o personagem
        </div>
        </div>
        </div>`;

        return cardPerson
    }

    priv.timerCountdown = () => {
        var timerDiv = $('#timer');

        var interval = setInterval(() => {
            var timer = $('.timerCountDown').html();
            timer = timer.split(':');
            var minutes = parseInt(timer[0], 10);
            var seconds = parseInt(timer[1], 10);
            seconds -= 1;
            if (minutes < 0)
                return clearInterval(interval);
            if (minutes < 10 && minutes.length != 2)
                minutes = '0' + minutes;
            if (seconds < 0 && minutes != 0) {
                minutes -= 1;
                seconds = 59;
            } else if (seconds < 10 && length.seconds != 2)
                seconds = '0' + seconds;
            $('span.timerCountDown').html(minutes + ':' + seconds);

            if (minutes == 0 && seconds == 0)
                clearInterval(interval);
            if ($('span.timerCountDown').html() == '00:00') {

                priv.dialogFinishTime();
            }

        }, 1000);
    }



    priv.previousP = function() {

        var url = $(this).attr("linkP");
        var urlArray = url.split(urlApi);
        urlArray = urlArray[1].split("/");
        var tipo = urlArray[0];
        var id = urlArray[1];
        priv.carregaApi(tipo, id, true);

    }

    priv.nextP = function() {

        var url = $(this).attr("linkN");
        var urlArray = url.split(urlApi);
        urlArray = urlArray[1].split("/");
        var tipo = urlArray[0];
        var id = urlArray[1];

        priv.carregaApi(tipo, id, true);
    }

    priv.modalDetails = function() {
        console.log($(this).closest('.personagemCard').attr('pontos', '5'));
        var idPerson = $(this).attr("idPerson");
        var titleDialog = $('.mdl-dialog__title');

        if (idPerson) {
            priv.carregaApi('people', idPerson);
            var dialog = document.querySelector('dialog');
            titleDialog.html('Detalhes');
            $('.close').show();
            dialog.showModal();
        }
    }

    priv.closeModal = () => {
        var dialog = document.querySelector('dialog');
        var detailPerson = $('.detailsPerson');
        var titleDialog = $('.mdl-dialog__title').html('');
        detailPerson.html('');
        $('.loadDetails').show();
        dialog.close();

    }

    priv.mountDetails = (person) => {
        var detailPerson = $('.detailsPerson');
        $('.loadDetails').hide();

        priv.returnPlanets(person.homeworld);
        priv.returnSpecies(person.species);
        priv.returnFilms(person.films);

        content = `

            <div class="mdl-grid">
            
            <div mdl-cell mdl-cell--12-col mdl-cell--1-offset>
            <figure class="mdl-card__media">
                <img src="${person.thumbnail}" alt="starWarsLoading" />
            </figure>   
            </div>   
            <div class="mdl-layout-spacer"></div>         
                <div mdl-cell mdl-cell--12-col >
                    <div><strong>Espécie:</strong><span class="especie"></span></div>
                    <div><strong>Altura: </strong> ${person.height}</div>
                    <div><strong>Cabelo: </strong> ${person.hair_color}</div>
                    <div><strong>Planeta: </strong> <span class="planeta"></span></div>
                    <div class="films"><strong>Filmes: </strong></div>            
                </div>

            </div>



        `;
        detailPerson.html(content);

    }

    priv.returnSpecies = (species) => {

        $.each(species, function(i, specie) {
            var urlArray = species[i].split(urlApi);
            urlArray = urlArray[1].split("/");
            var tipo = urlArray[0];
            var id = urlArray[1];
            priv.carregaApi(tipo, id);
        })

    }

    priv.mountSpecies = (species) => {
        $.each(species, function(i, specie) {
            $("span.especie").html(species.name);
        });
    }

    priv.returnPlanets = (planets) => {

        var urlArray = planets.split(urlApi);
        urlArray = urlArray[1].split("/");
        var tipo = urlArray[0];
        var id = urlArray[1];
        priv.carregaApi(tipo, id);

    }

    priv.mountPlanets = (planets) => {
        $("span.planeta").html(planets.name);
    }

    priv.returnFilms = (films) => {

        $.each(films, function(i, film) {
            var urlArray = films[i].split(urlApi);
            urlArray = urlArray[1].split("/");
            var tipo = urlArray[0];
            var id = urlArray[1];
            priv.carregaApi(tipo, id);
        })

    }

    priv.mountFilms = (films) => {

        $(".films").append('<div class="filmList"><span class="mdl-chip"><span class="mdl-chip__text">' + films['title'] + '</span></span></div>');

    }

    priv.modalAnswer = function() {
        var idPerson = $(this).attr("idPerson");
        var namePerson = $(this).attr("namePerson");

        var titleDialog = $('.mdl-dialog__title');
        var detailPerson = $('.detailsPerson');

        var pontoCard = $(this).closest('.personagemCard').attr('pontos');

        $('.close').hide();
        var content = `
        
        <form action="#">
        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <span>Digite o nome do Personagem:</span>
            <input class="mdl-textfield__input" type="text" id="nameAnswer">
            <div class="errou animated rubberBand" style="display:none;">Resposta errada. Tente novamente!</div>
            
            
        </div>

        <div class="mdl-dialog__actions">
            
            <button type="button" class="mdl-button close"> Cancelar </button>
            <button type="button" class="mdl-button confirmarResposta" nameOk="${namePerson}" idperson="${idPerson}" pontoResposta="${pontoCard}"> Responder </button>
        </div>
        </form>
        
            
               
        `;

        detailPerson.html(content);


        var dialog = document.querySelector('dialog');
        dialog.showModal();

    }

    priv.confirmarResposta = () => {
        var nameAnswer = $('#nameAnswer').val();
        var nameOk = $('.confirmarResposta').attr("nameOk");
        var detailPerson = $('.detailsPerson');
        var idPerson = $('.confirmarResposta').attr("idPerson");


        if (nameOk.toLowerCase() == nameAnswer.toLowerCase()) {
            var pontoCard = $('.confirmarResposta').attr("pontoResposta");
            var pontosTotal = $('.pontos').text();


            pontuacao = parseInt(pontoCard) + parseInt(pontosTotal);
            $('.pontos').html(pontuacao);
            var dialog = document.querySelector('dialog');

            $(`.responder${idPerson}`).html('<span class="mdl-chip mdl-chip--contact animated rubberBand"><span class="mdl-chip__contact mdl-color--teal mdl-color-text--white">C</span><span class="mdl-chip__text">Correto</span></span>            ');

            dialog.close()
        } else {
            $('#nameAnswer').val('');
            $('.errou').show();
        }
    }

    priv.modalStart = function() {
        var idPerson = $(this).attr("idPerson");
        var detailPerson = $('.detailsPerson');
        var dialog = document.querySelector('dialog');
        var navPerson = $('.navPerson');
        navPerson.hide();
        detailPerson.html('');
        $('#loading').hide();
        $('.close').hide();

        var titleDialog = $('.mdl-dialog__title');
        //titleDialog.html('STAR WARS QUIZ');

        var content =
            `
           <div class="logo"><img src="./assets/images/clone.png" alt="starWarsLoading"/></div>
           
           <p><strong>Regras do jogo StarWars Quiz:</strong></p>
           <ul>
            <li>Para responder o Quiz, clique no responder e digite o nome do personagem.</li>
            <li>Você pode responder quantas vezes quiser até acertar.</li>
            <li>Cada resposta sem ajuda das informações vale 10 pontos. </li>
            <li>Cadas resposta com ajuda vale 5 pontos</li>
            <li>Você tem dois minutos para mostrar que é um verdadeiro Jedi!</li>
            <li><strong>A Api do Google [versão Free] permite apenas 100 requisições de imagens, logo pode ser que o as imagens parem de aparecer devido isto; </strong></li>
           </ul>

        </div>


        `;
        detailPerson.html(content);
        dialog.showModal();
    }


    priv.startGame = () => {
        var dialog = document.querySelector('dialog');
        var detailPerson = $('.detailsPerson');
        var titleDialog = $('.mdl-dialog__title').html('');

        detailPerson.html('');

        $('.loadDetails').show();
        $('.closeStart').hide();
        $('.close').show();


        dialog.close();

        priv.startAll();

    }

    priv.saveWinnerList = () => {


        var winners = [];
        var nameWinner = $('#nameWinner').val();
        var emailWinner = $('#emailWinner').val();
        var pontuacaoTotal = $('.pontos').text();

        if (nameWinner == '') {

            $('.nameWinnerVazio').show();
            return;
        }

        if (emailWinner == '') {

            $('.emailWinnerVazio').show();
            return;
        }


        winners.push({
            name: nameWinner,
            points: pontuacaoTotal
        });

        localStorage.setItem('winners', JSON.stringify(winners));

        var array = localStorage.getItem('winners');
        $('#saveWinner').hide();
        ('.closeStart').show();
        priv.modalStart();

    }



    priv.startAll = () => {
        var dialog = document.querySelector('dialog');
        var navPerson = $('.navPerson');
        var gridCardsPerson = $('#gridCardsPerson');

        priv.carregaApi('people', '');
        var navPerson = $('.navPerson');
        dialog.close();
        navPerson.show();
        $('#loading').hide();
        $('.pontos').text('0');
        gridCardsPerson.hide();

        $('.timerCountDown').text('02:00');
        priv.timerCountdown();


    }


    priv.dialogFinishTime = () => {


        var detailPerson = $('.detailsPerson');
        var gridCardsPerson = $('#gridCardsPerson');
        var dialog = document.querySelector('dialog');
        var navPerson = $('.navPerson');
        var titleDialog = $('.mdl-dialog__title');
        var pontuacaoFinal = $('.pontos').text();

        navPerson.hide();
        gridCardsPerson.hide();
        detailPerson.html('');
        $('#loading').hide();
        $('.close').hide();
        titleDialog.html(`Você fez  ${pontuacaoFinal} Pontos!`);

        var content = `
            <form action="#">
            <div>
                <span>Preencha o formulario abaixo para salvar sua pontuação:</span>

                <div>
                <span>Nome: </span><input class="mdl-textfield__input" type="text" required="required" id="nameWinner">
                <span class="errou nameWinnerVazio animated fadeIn">Inválido</span>
                
                </div>
                <div>
                <br/>
                <span>E-mail: </span>
                <input class="mdl-textfield__input" type="email" required="required" id="emailWinner">
                <span class="errou emailWinnerVazio animated fadeIn">Inválido</span>
                </div>
            <div>
                
            </div>
    
            <div class="mdl-dialog__actions">
                
                <button type="button" class="mdl-button close"> Cancelar </button>
                <button type="button" class="mdl-button resetGame"> Jogar Novamente </button>
                <button type="button" class="mdl-button saveWinner"> Salvar </button>
                <!-- <button type="button" class="mdl-button rankingWinners"> Ranking </button> -->
                
            </div>
            </form>            
        
        `;
        detailPerson.html(content);
        dialog.showModal();

    }
})();