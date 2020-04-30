precision mediump float;


varying vec3    curPos;

// sphere uniforms
uniform float   sphereRadii[9];
uniform vec3    sphereCenters[9];
uniform int     sphereValues[9];
uniform int     sphereCount;


#define MAX_DISTANCE    100.0
#define SPHERE_OBJECT   1
#define CUBE_OBJECT     2


struct Ray
{
        vec3 origin;
        vec3 direction;
};

//////// RAY TRACING FUNCTION DEFINITIONS ////////
vec4    traceRay(Ray ray);
vec2    closestIntersectionObject(Ray ray);
float   doesSphereIntersect(Ray ray, vec3 center, float radius);
vec4    calculateIntersectionResult(vec2 obj);
//////// RAY TRACING FUNCTION DEFINITIONS ////////


void main()
{
        gl_FragColor = traceRay( Ray(curPos, vec3(0, 0, -1.0)) );
}
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
vec4 traceRay(Ray ray)
{
        vec2 intersectingObj = closestIntersectionObject(ray);

        if (intersectingObj.y > 0.0)
                return calculateIntersectionResult(intersectingObj);
        else
                return vec4(1.0, 1.0, 1.0, 1.0);        // for now the background color will all be white.
}
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
vec2 closestIntersectionObject(Ray ray)
{
        vec2 ret          = vec2(0.0, -1.0);
        float minDistance = MAX_DISTANCE;

        // run through sphere objects
        for (int i=0; i<9; ++i)
        {
                float distance = doesSphereIntersect(ray, sphereCenters[i], sphereRadii[i]);

                if (distance < minDistance)
                {
                        ret = vec2(SPHERE_OBJECT, float(i));
                        minDistance = distance;
                }

                if (i == sphereCount)
                        break;
        }

        // run through cube objects

        return ret;
}
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
float doesSphereIntersect(Ray ray, vec3 center, float radius)
{
        vec3  poi;      // point of intersection
        bool intersect = false;

        // figure out if the sphere intersects, and if so at which point.
        float v = dot(center - ray.origin, ray.direction);
        float disc = pow(radius,2.0) - pow(distance(center, ray.origin), 2.0) + pow(v, 2.0);
        if (disc > 0.0)
        {
                intersect = true;
                poi = ray.origin + ( v - sqrt(disc) )*ray.direction;
        }

        if (intersect)
                return distance(ray.origin, poi);
        else
                return MAX_DISTANCE;
}
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
vec4 calculateIntersectionResult(vec2 obj)
{
        return vec4(1.0, 0.0, 0.0, 1.0);
}
