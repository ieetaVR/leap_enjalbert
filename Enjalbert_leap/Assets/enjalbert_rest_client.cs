using UnityEngine;
using System.Collections;

public class enjalbert_rest_client : MonoBehaviour {


    public Level_master masterLVL;
    public leap_enjalbert_lift_arm lift_arm_script;
    public grab grab_script_left;
    public grab grab_script_right;
    public pinch_counter pinch_counter_script;
    public pinch_hand_test pinchHandTestLeft;
    public pinch_hand_test pinchHandTestRight;

    public enjalbert_time_keeper timer;


    public JSONObject testToDo = new JSONObject();
    string server_url = "http://localhost:8080/";

    IEnumerator Start()
    {
        string url = server_url + "getTestToDo";

        WWW www = new WWW(url);
        yield return www;

        Debug.Log("REST testToDo: " + www.text);
        testToDo = new JSONObject(www.text);


        switch(masterLVL.currentLevel)
        {
            case 1:
            case 2:
                lift_arm_script.setRESTParameters();
                break;
            case 3:
                grab_script_left.setRESTParameters();
                grab_script_right.setRESTParameters();
                break;
            case 4:
            case 5:
                pinch_counter_script.setRESTParameters();
                if(testToDo.GetField("hand").str.Equals("left"))
                {
                    pinchHandTestLeft.workFlag = 1;
                }
                else
                {
                    pinchHandTestRight.workFlag = 1;
                }
                break;

            default:
                break;
        }
        
        if(masterLVL.currentLevel != 0)
            timer.setRESTParameters();

    }

    // Use this for initialization
    /*void Start () {
        

        Debug.Log(testToDo.ToString());
	
	}*/

    bool paramSet = false;
	
	// Update is called once per frame
	void Update () {
        if(Input.GetKeyDown("r"))
        {
            Debug.Log("REST testToDo: " + testToDo.ToString());
        }
	/*
        if(paramSet==false)
        {
            if(testToDo != null)
            {
                lift_arm_script.setRESTParameters();
                paramSet = true;
            }

        }*/
	}
}
