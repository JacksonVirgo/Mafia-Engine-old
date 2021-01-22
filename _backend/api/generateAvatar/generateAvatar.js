const { createCanvas } = require('canvas');
const fs = require('fs');

const avatarWidth = 120;
const avatarHeight = 100;

function generateAvatarWithSeed(seed) {
    const canvas = createCanvas(avatarWidth, avatarHeight);
    const context = canvas.getContext('2d');

    const width = avatarWidth;
    const height = avatarHeight;

    context.fillStyle = '#0F0';
    context.fillRect(0, 0, width, height);

    context.font = 'bold 70pt Menlo';
    context.textAlign='center';
    context.fillStyle = '#f0f';
    context.fillText(seed, width/2, height/2);

    const buffer = canvas.toBuffer('image/png');
}

module.exports = {
    generateAvatarWithSeed
}