export abstract class Game {
    
    abstract setUpHTML(element: HTMLElement): void;

    abstract setUpSocket(): void;

    abstract tearDownSocket(): void;
}