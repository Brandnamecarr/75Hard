
class Test {

    constructor(name, passed)
    {
        this.name = name;
        this.passed = passed;
    }

    getTestResult() {
        return this.passed;
    }

    getName() {
        return this.name;
    }

} // Test //