export function Lerp(a, b, lerpFactor) {
    const result = ((1 - lerpFactor) * a) + (lerpFactor * b);
    return result;
}

// Lerps from angle a to b (both between 0.f and 360.f), taking the shortest path
export function LerpDegrees(a, b, lerpFactor) {
    let result;
    const diff = b - a;
    if (diff < -180)
    {
        // lerp upwards past 360
        b += 360;
        result = Lerp(a, b, lerpFactor);
        if (result >= 360)
        {
            result -= 360;
        }
    }
    else if (diff > 180)
    {
        // lerp downwards past 0
        b -= 360;
        result = Lerp(a, b, lerpFactor);
        if (result < 0)
        {
            result += 360;
        }
    }
    else
    {
        // straight lerp
        result = Lerp(a, b, lerpFactor);
    }

    return result;
}