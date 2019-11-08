import { assert } from "@packages/core-kernel/src/utils/assert";
import { Blocks, Interfaces, Managers } from "@arkecosystem/crypto";

import { Generators } from "@packages/core-test-framework";

let block: Interfaces.IBlock;
beforeAll(() => {
    // todo: completely wrap this into a function to hide the generation and setting of the config?
    Managers.configManager.setConfig(new Generators.GenerateNetwork().generateCrypto());

    // Black Magic to get the genesis block to pass
    Managers.configManager.getMilestone().aip11 = false;

    block = Blocks.BlockFactory.fromJson(Managers.configManager.get("genesisBlock"));
});

describe("Assertions", () => {
    it(".defined", () => {
        expect(() => assert.defined(undefined)).toThrow("Expected the input to be defined.");
        expect(() => assert.defined("abc")).not.toThrow();
    });

    it(".null", () => {
        expect(() => assert.null("abc")).toThrow("Expected the input to be null.");
        expect(() => assert.null(null)).not.toThrow();
    });

    it(".sameLength", () => {
        expect(() => assert.sameLength([], [1])).toThrow("Expected the inputs to have the same length.");
        expect(() => assert.sameLength([], [])).not.toThrow();
    });

    it(".block", () => {
        expect(() => assert.block("abc")).toThrow("Expected the input to be a block instance.");
        expect(() => assert.block(block)).not.toThrow();
    });

    it(".transaction", () => {
        expect(() => assert.transaction("abc")).toThrow("Expected the input to be a transaction instance.");
        expect(() => assert.transaction(block.transactions[0])).not.toThrow();
    });

    describe("#not", () => {
        it(".defined", () => {
            expect(() => assert.not.defined("abc")).toThrow("Expected the input not to be defined.");
            expect(() => assert.not.defined(undefined)).not.toThrow();
        });

        it(".null", () => {
            expect(() => assert.not.null(null)).toThrow("Expected the input not to be null.");
            expect(() => assert.not.null("abc")).not.toThrow();
        });

        it(".sameLength", () => {
            expect(() => assert.not.sameLength([], [])).toThrow();
            expect(() => assert.not.sameLength([], [1])).not.toThrow("Expected the inputs to have the same length.");
        });

        it(".block", () => {
            expect(() => assert.not.block(block)).toThrow();
            expect(() => assert.not.block("abc")).not.toThrow("Expected the input to be a block instance.");
        });

        it(".transaction", () => {
            expect(() => assert.not.transaction(block.transactions[0])).toThrow();
            expect(() => assert.not.transaction("abc")).not.toThrow("Expected the input to be a transaction instance.");
        });
    });
});