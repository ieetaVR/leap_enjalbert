using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Text;

public class leap_enjalbert_lift_arm : MonoBehaviour {
    
    public float range = 3;

    public int secondsToCount = 10;
    public Color altColor = Color.green;
    float green = 0.1f;

    //public text_change text_changeReference;
    //public TypeOutScript bestText;
    public text_master bestText;
    public change_color phantomHandColor;
    //public text_change bestTextQuick;
    public Level_master masterLVL;

    float t, newT, lastCollisionEnter;
    int secsPassed;
    bool firstCol = true, taskComplete = false;
    string currentCollider = "";
    public int workFlag = 0;

    // Use this for initialization
    void Start()
    {
        //GameObject text3d = GameObject.Find("info_text");
        //text_changeReference = text3d.GetComponent<text_change>();
        GetComponent<Renderer>().material.color = new Color(0, 0, 0, 1);
        workFlag = 0;


    }


    public void setWorkFlag(int new_val)
    {
        workFlag = new_val;
        //bestText.TotalTypeTime = 0f;

    }


    void OnCollisionStay(Collision collision)
    {
        if(workFlag == 1)
        {
            if (taskComplete == false)
            {
                newT = Time.time;
                int secsPassed_now = (int)(newT - t);
                if (secsPassed_now > secsPassed)
                {
                    secsPassed = secsPassed_now;
                    //bestTextQuick.setCurrentText("secs left: " + (secondsToCount - secsPassed).ToString());
                    /*bestText.reset = true;
                    bestText.FinalText = "secs left: " + (secondsToCount - secsPassed).ToString();
                    bestText.On = true;*/
                    bestText.setCurrentText("secs left: " + (secondsToCount - secsPassed).ToString(), 0f);


                    green += 0.1f;
                    GetComponent<Renderer>().material.color = new Color(0, green, 0, 1);
                    Debug.Log((float)secsPassed / secondsToCount);
                    phantomHandColor.setColor((float)secsPassed /secondsToCount);

                    if (secsPassed == secondsToCount)
                    {
                        //text_changeReference.setCurrentText("task completed");
                        /*bestText.reset = true;
                        bestText.FinalText = "task completed";
                        bestText.On = true;*/
                        bestText.setCurrentText("Task Completed.", 2f);
                        Debug.Log("Task Complete!");
                        taskComplete = true;
                        workFlag = 0;
                        green = 0.1f;

                        masterLVL.taskFinalStage();

                    }
                }
            }
        }
        
        

       
    }


    void OnCollisionEnter(Collision col)
    {

        if (workFlag == 1)
        {

            if (!(col.gameObject.transform.parent.transform.parent.name.Equals(currentCollider) || col.gameObject.transform.parent.name.Equals(currentCollider)))
            {
                //Debug.Log("new col");
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
                if (extra_T - newT > 1 && taskComplete == false)
                {
                    //Debug.Log("new col");
                    lastCollisionEnter = Time.time;
                    currentCollider = col.gameObject.transform.parent.transform.parent.name;
                    t = Time.time;
                    newT = 0;
                    secsPassed = 0;
                    GetComponent<Renderer>().material.color = new Color(0, 0, 0, 1);

                }
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
