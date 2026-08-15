export function percentToLetter(percent: number | null): string {
    if (percent === null) return "-";

    if (percent >= 80) return "A+";
    if (percent >= 75) return "A";
    if (percent >= 70) return "A-";
    if (percent >= 65) return "B+";
    if (percent >= 60) return "B";
    if (percent >= 55) return "B-";
    if (percent >= 50) return "C+";
    if (percent >= 45) return "C";
    if (percent >= 40) return "D";
    
    return "F";
}