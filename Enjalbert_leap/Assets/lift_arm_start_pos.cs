using UnityEngine;
using System.Collections;

public class lift_arm_start_pos : MonoBehaviour {

    public leap_enjalbert_lift_arm top_bar_ref;
    public text_change info_text_ref;

	// Use this for initialization
	void Start () {
        top_bar_ref.setWorkFlag(0);
        info_text_ref.setCurrentText("place arm on start");

    }


    void OnCollisionStay(Collision collision)
    {
        Debug.Log("col on start");
        top_bar_ref.setWorkFlag(1);
        info_text_ref.setCurrentText("lift arm to top bar");
    }


    // Update is called once per frame
    void Update () {
	
	}
}
