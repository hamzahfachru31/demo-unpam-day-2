// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleStorage {
    // menyimpan sebuah nilai dalam bentuk uint256
    uint256 private storedValue;
    address public owner;

    event ValueUpdated(uint256 newValue);

    function setValue(uint256 _value) public {
        storedValue = _value;
        emit ValueUpdated(_value);
    }

    function getValue() public view returns (uint256) {
        return storedValue;
    }
}