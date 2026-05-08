export class o_applicationInfo{
    static $categories = ["", "Czas wolny", "Szkoła", "Praca", "Dom", "Inne"];
    static $appFonts = ["sans-serif", "serif", "Arial", "Calibri", "Arial", "Comic Sans Ms"];
    static $choosedFont = null;
    static $primaryAppColor = window.getComputedStyle(document.body).getPropertyValue("--primary-color");
    static $tasks = [
        {
            topic: "Trening na siłowni",
            description: "Zrobić pełny trening FBW, a po wszystkim 20 minut cardio na bieżni.",
            category: o_applicationInfo.$categories[1],
        },
        {
            topic: "Przygotowanie do sprawdzianu",
            description: "Powtórzyć rozdział o układzie krwionośnym i zrobić notatki z najważniejszych pojęć.",
            category: o_applicationInfo.$categories[2],
        },
        {
            topic: "Analiza raportu kwartalnego",
            description: "Przejrzeć dane sprzedażowe z ostatnich 3 miesięcy i przygotować krótką prezentację na spotkanie.",
            category: o_applicationInfo.$categories[3],
        },
        {
            topic: "Generalne porządki w kuchni",
            description: "Przejrzeć daty ważności w szafkach, umyć lodówkę i uporządkować przyprawy.",
            category: o_applicationInfo.$categories[4],
        },
        {
            topic: "Rezerwacja biletów do kina",
            description: "Sprawdzić repertuar na weekend i kupić dwa bilety na seans wieczorny.",
            category: o_applicationInfo.$categories[5],
        },
        {
            topic: "Planowanie budżetu",
            description: "Podsumować wydatki z zeszłego miesiąca i ustalić limity na jedzenie oraz rozrywkę.",
            category: o_applicationInfo.$categories[1],
        },
    ]
}