using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class leap_enjalbert_lift_arm : MonoBehaviour {
    
    public float range = 3;

    public int secondsToCount = 10;
    public Color altColor = Color.green;
    float green = 0.1f;

    public text_change text_changeReference;

    float t, newT, lastCollisionEnter;
    int secsPassed;
    bool firstCol = true, taskComplete = false;
    string currentCollider = "";

    // Use this for initialization
    void Start()
    {
        GameObject text3d = GameObject.Find("info_text");
        text_changeReference = text3d.GetComponent<text_change>();
        GetComponent<Renderer>().material.color = new Color(0, 0, 0, 1);


    }





    void OnCollisionStay(Collision collision)
    {
        if(taskComplete == false)
        {
            newT = Time.time;
            int secsPassed_now = (int)(newT - t);
            if (secsPassed_now > secsPassed)
            {
                secsPassed = secsPassed_now;
                text_changeReference.setCurrentText("secs left: " + (secondsToCount - secsPassed).ToString());
                green += 0.1f;
                GetComponent<Renderer>().material.color = new Color(0, green, 0, 1);

                if (secsPassed == secondsToCount)
                {
                    text_changeReference.setCurrentText("task completed");
                    Debug.Log("Task Complete!");
                    taskComplete = true;
                }
            }
        }
        

       
    }


    void OnCollisionEnter(Collision col)
    {
        
        
        if(!(col.gameObject.transform.parent.transform.parent.name.Equals(currentCollider) || col.gameObject.transform.parent.name.Equals(currentCollider)))
        {
            Debug.Log("new col");
            lastCollisionEnter = Time.time;
            currentCollider = col.gameObject.transform.parent.transform.parent.name;
            t = Time.time;
            newT = 0;
            secsPassed = 0;
            GetComponent<Renderer>().material.color = new Color(0, 0, 0, 1);
            taskComplete = false;
        }
        else
        {
            float extra_T = Time.time;
            if(extra_T-newT > 1 && taskComplete==false)
            {
                Debug.Log("new col");
                lastCollisionEnter = Time.time;
                currentCollider = col.gameObject.transform.parent.transform.parent.name;
                t = Time.time;
                newT = 0;
                secsPassed = 0;
                GetComponent<Renderer>().material.color = new Color(0, 0, 0, 1);

            }
        }


    }


    void OnCollisionExit(Collision collisionInfo)
    {
        //print("No longer in contact with " + collisionInfo.transform.name);

    }

    void goBack()
    {
        
    }


    // Update is called once per frame
    void Update()
    {

        if (Input.GetKeyDown("z"))
        {
            goBack();

        }

    }
}
