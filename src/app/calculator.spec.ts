import { Calculator } from "./calculator";

//Describe: Describe las pruebas
describe('Test for Calculator', () => {
    describe('Tests for Multiply', () => {
        //It: Define la historia
        it('multiply should return a nine', () => {
            //La prueba deberia seguir el mantra de las 3 A
            // En el mundo de las pruebas, esto es lo más común

            // Arrange: Preparar Utensilios,
            const calculator = new Calculator();

            // Act: Ejecutar el código a probar,
            const rta = calculator.multiply(3, 3);

            // Assert: Resolver hipotesis, ¿Cómo deberia actuar?
            expect(rta).toEqual(9);
        })
    })

    describe('Tests for Divide', () => {
        it('divide should return some numbers', () => {
            // Arrange
            const calculator = new Calculator();
    
            // Act and assert:
            expect(calculator.divide(6, 3)).toEqual(2);
            expect(calculator.divide(5, 2)).toEqual(2.5);
        })

        it('divide for a zero', () => {
            // Arrange
            const calculator = new Calculator();
    
            // Act and assert:
            expect(calculator.divide(6, 0)).toBeNull();
            expect(calculator.divide(5, 0)).toBeNull();
            expect(calculator.divide(4564642, 0)).toBeNull();
        })
    })

   
    it('#Test matchers', () => {
        // Arrange
        const name = 'Victor';
        let name2;

        expect(name).toBeDefined();
        expect(name2).toBeUndefined();
        //Nota el valor null si es un valor definido

        expect(1 + 3 === 4).toBeTruthy(); //false
        expect(1 + 3 === 3).toBeFalsy(); //true

        expect(5).toBeLessThan(10);
        expect(20).toBeGreaterThan(10);

        expect('123456').toMatch(/123/) //toMatch espera una expresión regular
        expect(['apples', 'oranges', 'pears']).toContain('oranges');
    })
    
});