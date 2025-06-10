import type {PreliminaryCompilerInfo} from '../../types/compiler.interfaces.js';
import {BaseCompiler} from '../base-compiler.js';
import type {CompilationEnvironment} from '../compilation-env.js';

export class FasmgCompiler extends BaseCompiler {
    private readonly includePath: string | undefined;

    static get key() {
        return 'fasmg';
    }

    constructor(compilerInfo: PreliminaryCompilerInfo, env: CompilationEnvironment) {
        super(compilerInfo, env);
        this.includePath = this.compilerProps<string | undefined>(`compiler.${this.compiler.id}.includePath`);
    }

    override optionsForFilter(filters, outputFilename) {
        return [];
    }

    override prepareArguments(userOptions, filters, backendOptions, inputFilename, outputFilename) {
        // fasmg syntax: fasmg source [output]
        return [inputFilename, outputFilename];
    }

    override getDefaultExecOptions() {
        const execOptions = super.getDefaultExecOptions();

        // Set INCLUDE environment variable to find include files if configured
        if (this.includePath) {
            execOptions.env = {
                ...execOptions.env,
                INCLUDE: this.includePath,
            };
        } else {
            // error
            throw new Error('includePath is not set');
        }

        return execOptions;
    }
}
