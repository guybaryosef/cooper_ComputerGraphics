precision mediump float;

varying vec3    curPos;

uniform vec3    BasisVecs[2];
uniform vec3    eyeVec;

// sphere uniforms
uniform float   sphereRadii[9];
uniform vec3    sphereCenters[9];
uniform int     sphereCount;
uniform vec4    sphereColors[9];
uniform float   sphereReflectivity[9];
uniform int     reflectionCount;


#define MAX_DISTANCE    100.0
#define SPHERE_OBJECT   1
#define CUBE_OBJECT     2
#define NO_INTERSECTION -100.0
#define PI              3.1415926538

struct Ray
{
        vec3 origin;
        vec3 direction;
};


//////// RAY TRACING FUNCTIONS ////////
ivec2   closestIntersectionObject(Ray ray);
vec4    calculateIntersectionResult(Ray ray, ivec2 obj, inout float frac_value);
vec4    combineColors(vec4 point_color, vec4 reflect_color, float reflectivity);
Ray     calculateNewRay(Ray incoming_ray, ivec2 intersectionObj);

//////// SPHERE RAY TRACING FUNCTIONS ////////
float   doesSphereIntersect(Ray ray, vec3 center, float radius);
vec3    getSphereIntersection(Ray ray, vec3 center, float radius);


void main()
{
        float r = sqrt( dot(curPos.xy, curPos.xy) );
        float t = acos( dot(curPos.xy, vec2(0.0, 1.0))/r );
        if (curPos.x > 0.0001)
                t = -t;

        if (eyeVec.z < 0.0001)
                r = -r;

        vec3 real_pos = eyeVec + r * (cos(t) * BasisVecs[0] + sin(t) * BasisVecs[1]);
        vec3 real_dir = normalize( -eyeVec );
        Ray  cur_ray  = Ray(real_pos, real_dir);

        float current_color_percent = 1.0;
        vec4  overallColor          = vec4(0.0, 0.0, 0.0, 1.0);

        bool found = false;
        for (int i=0; i<10; ++i)
        {
                if (i == reflectionCount)      // annoying way to make a variable length loop
                        break;

                ivec2 intersectingObj = closestIntersectionObject(cur_ray);
                if (intersectingObj.y > -1)
                {
                        found = true;
                        overallColor += calculateIntersectionResult(cur_ray, intersectingObj, current_color_percent);
                        cur_ray = calculateNewRay(cur_ray, intersectingObj);
                }
                else
                        break;
        }

        overallColor.w = 1.0;
        gl_FragColor = found ? overallColor : vec4(1.0, 1.0, 1.0, 1.0);
}
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
ivec2 closestIntersectionObject(Ray ray)
{
        ivec2 ret          = ivec2(-1, -1);     // vec2(OBJECT_TYPE, index)
        float minDistance = MAX_DISTANCE-1.0;

        // run through sphere objects
        for (int i=0; i<9; ++i)
        {
                if (i == sphereCount)
                        break;

                float distance = doesSphereIntersect(ray, sphereCenters[i], sphereRadii[i]);
                if (distance < minDistance)
                {
                        ret = ivec2(SPHERE_OBJECT, i);
                        minDistance = distance;
                }
        }

        return ret;
}
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
float doesSphereIntersect(Ray ray, vec3 center, float radius)
{
        vec3 poi = getSphereIntersection(ray, center, radius);
        if (poi.x-1.0 < NO_INTERSECTION)        // -1.0 used bc of floating point imprecision
                return MAX_DISTANCE;
        else
                return distance(ray.origin, poi);
}
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
vec3 getSphereIntersection(Ray ray, vec3 center, float radius)
{
        vec3  eo = center - ray.origin;
        float v  = dot(eo, ray.direction);
        float disc = pow(radius, 2.0) - pow(distance(center, ray.origin), 2.0) + pow(v, 2.0);

        if (disc > -0.01 && v-sqrt(disc) > 0.01)
                return ray.origin + ( v - sqrt(disc) )*ray.direction;   // point of intersection
        else
                return vec3(NO_INTERSECTION, 0.0, 0.0);  // a way to return NO_INTERSECTION

}
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
vec4 calculateIntersectionResult(Ray ray, ivec2 obj, inout float frac_value)
{
        // really incoherent way to do this, but indices and loops need to have constant values
        for (int i=0; i<9; ++i)
        {
                if (i == obj.y)
                {
                        if (obj.x == SPHERE_OBJECT)
                        {
                                vec4 color = frac_value * (1.0-sphereReflectivity[i]) * sphereColors[i];
                                frac_value = frac_value * sphereReflectivity[i]; // update frac_value
                                return color;
                        }
                }
        }
        return vec4(0.0, 0.0, 0.0, 1.0);        // should never be reached- means an error
}
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Ray calculateNewRay(Ray incoming_ray, ivec2 intersectionObj)
{
        for (int i=0; i<9; ++i)
        {
                if (i == intersectionObj.y)
                {
                        if (intersectionObj.x == SPHERE_OBJECT)
                        {
                                vec3 poi    = getSphereIntersection(incoming_ray, sphereCenters[i], sphereRadii[i]);
                                vec3 normal = normalize(poi - sphereCenters[i]);
                                float c1    = dot( normal, incoming_ray.direction);

                                vec3  reflected_dir = normalize( incoming_ray.direction - 2.0*c1*normal );
                                return Ray(poi, reflected_dir);
                        }

                }
        }

        return Ray( vec3(0, 0, 0), vec3(0, 0, 0) );     // should never be reached
}
