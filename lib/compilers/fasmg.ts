import {BaseCompiler} from '../base-compiler.js';

export class FasmgCompiler extends BaseCompiler {
    static get key() {
        return 'fasmg';
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

        // Set INCLUDE environment variable to find include files
        execOptions.env = {
            ...execOptions.env,
            INCLUDE: '/app/fasm2/include',
        };

        return execOptions;
    }
}
