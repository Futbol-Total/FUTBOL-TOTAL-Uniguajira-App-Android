$(document).ready(function() {
    const apiKey = "b00c7604dfa98a9306953d830ca17589aa01fb354c545e56301dde3606abef21";
    const apiURL = "https://apiv2.allsportsapi.com/football/";

    // Update topLeagues with new competitions
    const topLeagues = {
        "Premier League": 148,
        "La Liga": 468,
        "Serie A": 135,
        "Bundesliga": 195,
        "Ligue 1": 176,
        "Primera A": 99,
        "UEFA Nations League": 1060,
        "CONMEBOL Qualifiers": 1070,
        "Euro Cup": 1080,
        "Copa America": 1090,
        "UEFA World Cup Qualifiers": 1100, // Example ID, replace with actual ID
        "CONMEBOL World Cup Qualifiers": 1110, // Example ID, replace with actual ID
        "World Cup": 1120, // Example ID, replace with actual ID
        "UEFA European Championship": 1130, // Example ID, replace with actual ID
        "UEFA Europa League": 1140, // Example ID, replace with actual ID
        "UEFA Conference League": 1150, // Example ID, replace with actual ID
        "UEFA Champions League": 1160, // Example ID, replace with actual ID
        "UEFA European Championship Qualifiers": 1170 // Example ID, replace with actual ID
    };

    // Arreglo de selecciones nacionales
    const topNationalTeams = [
        "Argentina", "France", "Brazil", "England", "Belgium", 
        "Netherlands", "Portugal", "Colombia", "Italy", "Uruguay", 
        "Croatia", "Germany", "Morocco", "Switzerland", "Japan", 
        "Spain", "USA", "Senegal", "Denmark", "Mexico",
        "Australia", "South Korea", "Ukraine", "Turkey", "Iran"
    ];

    // Arreglo de equipos importantes (sin selecciones nacionales)
    const topTeams = [
        "Barcelona", "Real Madrid", "Manchester City", "Bayern Munich", "Liverpool", 
        "AS Roma", "PSG", "Borussia Dortmund", "Inter", 
        "Chelsea", "Bayer Leverkusen","RB Leipzig", "Atlético Madrid",
        "Manchester United", "West Ham", "Arsenal",
        "Juventus", "AC Milan", "Napoli", 
        "Atlético Nacional", "Millonarios", "Junior", "Deportivo Cali"
    ];

    // Función para verificar si un equipo es importante
    function isImportantTeam(teamName) {
        return topTeams.includes(teamName) || topNationalTeams.includes(teamName);
    }

    function isImportantLeague(leagueId, leagueName, countryName) {
        const leagueIdInt = parseInt(leagueId);
        if (Object.values(topLeagues).includes(leagueIdInt)) {
            return true;
        }
        
        if (leagueName.toLowerCase().includes("uefa nations league") ||
            leagueName.toLowerCase().includes("conmebol qualifiers") ||
            leagueName.toLowerCase().includes("euro cup") ||
            leagueName.toLowerCase().includes("copa america") ||
            leagueName.toLowerCase().includes("uefa world cup qualifiers") ||
            leagueName.toLowerCase().includes("conmebol world cup qualifiers") ||
            leagueName.toLowerCase().includes("world cup") ||
            leagueName.toLowerCase().includes("uefa european championship") ||
            leagueName.toLowerCase().includes("uefa europa league") ||
            leagueName.toLowerCase().includes("uefa conference league") ||
            leagueName.toLowerCase().includes("uefa champions league") ||
            leagueName.toLowerCase().includes("uefa european championship qualifiers")) return true;

        if (leagueName.toLowerCase().includes("premier league") && 
            (countryName === "England" || countryName === "United Kingdom")) return true;
        
        if (leagueName.toLowerCase().includes("la liga") && 
            (countryName === "Spain" || countryName === "España")) return true;

        if (leagueName.toLowerCase().includes("serie a") && 
            (countryName === "Italy" || countryName === "Italia")) return true;

        if (leagueName.toLowerCase().includes("bundesliga") && 
            (countryName === "Germany" || countryName === "Alemania")) return true;

        if (leagueName.toLowerCase().includes("ligue 1") && 
            (countryName === "France" || countryName === "Francia")) return true;

        if (leagueName.toLowerCase().includes("primera a") && countryName === "Colombia") {
            return true;
        }

        return false;
    }

    function isStillRelevant(match) {
        if (match.event_status === "Finished") {
            const matchEndTime = moment.tz(`${match.event_date} ${match.event_time}`, "YYYY-MM-DD HH:mm", "America/Bogota");
            return moment().diff(matchEndTime, 'hours') < 1; // Sigue siendo relevante si ha pasado menos de 1 hora
        }
        return true; // Si no ha finalizado, sigue siendo relevante
    }

    function getFeaturedMatches() {
        const today = moment.tz("America/Bogota").format('YYYY-MM-DD');
        const futureDate = moment.tz("America/Bogota").add(7, 'days').format('YYYY-MM-DD');

        $.getJSON(apiURL, {
            met: 'Fixtures',
            APIkey: apiKey,
            from: today, 
            to: futureDate 
        }).done(function(data) {
            const matches = data.result;
            let featuredMatches = [];

            matches.forEach(match => {
                const isImportantLeagueMatch = isImportantLeague(match.league_id, match.league_name, match.country_name);
                const isImportantHomeTeam = isImportantTeam(match.event_home_team);
                const isImportantAwayTeam = isImportantTeam(match.event_away_team);
                const isMaleMatch = !match.league_name.toLowerCase().includes("women");

                if (isMaleMatch && isImportantLeagueMatch && (isImportantHomeTeam || isImportantAwayTeam)) {
                    featuredMatches.push({
                        ...match,
                        isLive: match.event_status === "Live",
                        isFinished: match.event_status === "Finished"
                    });
                }
            });

            // Ordenar partidos por fecha y hora del más cercano al más lejano
            featuredMatches.sort((a, b) => {
                const dateTimeA = moment.tz(`${a.event_date} ${a.event_time}`, "YYYY-MM-DD HH:mm", "America/Bogota");
                const dateTimeB = moment.tz(`${b.event_date} ${b.event_time}`, "YYYY-MM-DD HH:mm", "America/Bogota");
                return dateTimeA - dateTimeB; // Ascendente
            });

            // Partidos importantes del día
            const todayMatches = featuredMatches.filter(match => match.event_date === today && isStillRelevant(match));

            // Partidos importantes del día siguiente
            const tomorrowMatches = featuredMatches.filter(match => match.event_date === moment.tz("America/Bogota").add(1, 'day').format('YYYY-MM-DD') && isStillRelevant(match));

            // Partidos importantes de los próximos días
            const upcomingMatches = featuredMatches.filter(match => new Date(match.event_date) > new Date(moment.tz("America/Bogota").add(1, 'day').format('YYYY-MM-DD')));

            // Mostrar hasta 30 partidos en total, en orden cronológico
            let matchesToShow = todayMatches;

            // Si hay menos de 30 partidos hoy, añadir partidos del día siguiente y así sucesivamente
            if (todayMatches.length < 32) {
                const remainingSpaces = 32 - todayMatches.length;
                const tomorrowMatchesToAdd = tomorrowMatches.slice(0, remainingSpaces);
                matchesToShow = matchesToShow.concat(tomorrowMatchesToAdd);

                if (matchesToShow.length < 32) {
                    const remainingSpaces = 32 - matchesToShow.length;
                    const upcomingMatchesToAdd = upcomingMatches.slice(0, remainingSpaces);
                    matchesToShow = matchesToShow.concat(upcomingMatchesToAdd);
                }
            }

            showMatches(matchesToShow.slice(0, 32));

            console.log("Total de partidos obtenidos:", matches.length);
            console.log("Partidos destacados filtrados:", featuredMatches.length);
        }).fail(function(error) {
            console.log("Error al obtener los datos de la API:", error);
        });
    }

    function showMatches(matches) {
        for (let i = 0; i < matches.length; i++) {
            const match = matches[i];
            const matchElement = $(`#match${i+1}`);
            
            const matchDate = moment(match.event_date, "YYYY-MM-DD").isValid() ? moment(match.event_date).format('DD/MM/YYYY') : 'Fecha inválida';
            const matchTimeColombia = moment.tz(match.event_time, "America/Bogota").isValid() ? moment.tz(match.event_time, "America/Bogota").format('HH:mm') : 'Hora inválida';

            let matchLink = match.event_url || `widgetMatchResults.html?Premiére%20Ligue%20-${match.event_home_team}-vs-${match.event_away_team}/${match.event_date}/${match.event_key}`;
            matchLink = matchLink.replace("/en%20vivo/", "");

            let timeDisplay;
            if (match.isLive) {
                timeDisplay = `<p style="color:red;">Partido en vivo - ${match.event_ft_result}</p>`;
            } else if (match.isFinished) {
                timeDisplay = `<p style="color:green;">Finalizado - ${match.event_ft_result}</p>`;
            } else {
                timeDisplay = `<p>Fecha: ${matchDate} Hora: ${matchTimeColombia}</p>`;
            }

            const leagueName = Object.keys(topLeagues).find(key => topLeagues[key] === parseInt(match.league_id)) || match.league_name;

            matchElement.html(`
                <a href="${matchLink}" class="match-link">
                    <div class="match-teams">
                        <div class="team">
                            <img src="${match.home_team_logo}" alt="${match.event_home_team}" class="team-logo">
                            <span>${match.event_home_team}</span>
                        </div>
                        <span class="vs">VS</span>
                        <div class="team">
                            <span>${match.event_away_team}</span>
                            <img src="${match.away_team_logo}" alt="${match.event_away_team}" class="team-logo team-logo-right">
                        </div>
                    </div>
                    ${timeDisplay}
                    <p class="league-name">${leagueName}</p>
                </a>
            `);

            console.log("Match details:", {
                homeTeam: match.event_home_team,
                awayTeam: match.event_away_team,
                league: leagueName,
                country: match.country_name,
                date: matchDate
            });
        }
    }

    // Función para actualizar los partidos a las 00:00 y 12:00 hora de Colombia
    function scheduleUpdates() {
        const now = moment.tz("America/Bogota");
        let nextUpdate = moment.tz("America/Bogota").hour(0).minute(0).second(0);

        if (now.hour() >= 12) {
            nextUpdate = nextUpdate.add(1, 'day').hour(0); // Siguiente actualización a medianoche
        } else {
            nextUpdate.hour(12); // Actualizar a las 12:00
        }

        const msUntilNextUpdate = nextUpdate.diff(now);

        setTimeout(function() {
            getFeaturedMatches(); // Ejecuta la actualización
            scheduleUpdates();    // Programa la siguiente actualización
        }, msUntilNextUpdate);
    }

    getFeaturedMatches(); // Llama la primera vez
    scheduleUpdates();    // Programar actualizaciones automáticas

    // Código adicional para interfaz y widgets...
    $('#widgetCountries').widgetCountries({
        widgetLeagueLocation: '#widgetLeague',
        widgetLiveScoreLocation: '#widgetLiveScore',
        widgetWidth: '19%',
        preferentialLeagues: [1, 3, 4, 28, 302, 244, 207, 175, 168, 152]
    });

    const windowWidthSize = $(window).width();

    if (windowWidthSize < 769) {
        $('.logo-img-size-index').hide();
        $('.switchButton').css('margin', '0 auto');
        $('.mainPageHeader').css('margin', '0');
        $('.mainPageHeader').hide();
    }

    $('.switchButton').click(function() {
        if ($('.widgetLeague').length) {
            $('.widgetLiveScore').toggle();
            $('.widgetLeague').toggle();
        }
    });
});