const examples = [
    {
        name: "Hello, World!",
        code: `
println('Hello, world!')
`
    },
    {
        name: "Fibonacci",
        code: `
fn fib(a int, b int) {
    val := a + b
    println(val)
    if val < 1000 {
        fib(b, val)
    }
}

fib(0, 1)
`
    },
    {
        name: "String interpolation",
        code: `
areas := ['game', 'web', 'tools', 'science', 'systems', 'embedded', 'drivers', 'GUI', 'mobile']
for area in areas {
    println('Hello, $area developers!')
}
`
    }
].map((example) => {
    example.code = example.code.replaceAll("    ", "\t").trim();
    return example;
})
