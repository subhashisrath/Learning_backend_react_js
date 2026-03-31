GEC - Global Execution Context.
FEC - Function Execution Context.

JavaScript Code Execution
│
├── Execution Context
│   │
│   ├── Memory Phase (Hoisting)
│   │   ├── var → undefined
│   │   ├── let/const → TDZ
│   │   └── functions → full function stored
│   │
│   └── Execution Phase
│       ├── execute line-by-line
│       ├── assign values
│       └── function call → new FEC
│
├── Global Execution Context (GEC)
│   ├── Created once
│   ├── Global variables
│   ├── Global functions
│   └── Global object + this binding
│
├── Function Execution Context (FEC)
│   │
│   ├── Memory Phase
│   │   ├── arguments object
│   │   ├── local variables → undefined
│   │   └── inner function declarations hoisted
│   │
│   └── Execution Phase
│       ├── assign values
│       ├── compute
│       └── return → destroy context
│
└── Call Stack
    ├── LIFO structure
    ├── Only one context runs at a time
    ├── JS is single-threaded
    └── FEC pushed/popped as functions run
