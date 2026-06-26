
describe("Test calcul", () => {
    test("additionne 2 + 3", () => {
        const a = 2;
        const b = 3;
        const result = a + b;
        expect(result).toBe(5);
    });
    test("soustraction 2 - 3", () => {
        const a = 2;
        const b = 3;
        const result = a - b;
        expect(result).toBe(-1);
    });
    test("division 2 / 4", () => {
        const a = 2;
        const b = 4;
        const result = a / b;
        expect(result).toBe(0.5);
    });
    test("modulo 2 % 4", () => {
        const a = 2;
        const b = 4;
        const result = a % b;
        expect(result).toBe(2);
    });
});