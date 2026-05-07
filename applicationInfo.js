export class o_applicationInfo{
    static $categories = ["", "Czas wolny", "Szkoła", "Praca", "Dom", "Inne"];
    static $appFonts = ["sans-serif", "serif", "Arial", "Calibri", "Arial", "Comic Sans Ms"];
    static $choosedFont = null;
    static $primaryAppColor = window.getComputedStyle(document.body).getPropertyValue("--primary-color");
}