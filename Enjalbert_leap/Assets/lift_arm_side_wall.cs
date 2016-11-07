using UnityEngine;
using System.Collections;

public class lift_arm_side_wall : MonoBehaviour {


    public leap_enjalbert_lift_arm top_bar_ref;
    public text_change info_text_ref;

    // Use this for initialization
    void Start () {
	
	}

    void OnCollisionStay(Collision collision)
    {
        Debug.Log("col on wall");
        top_bar_ref.setWorkFlag(0);
        info_text_ref.setCurrentText("Wall bump - press start");
    }


    // Update is called once per frame
    void Update () {
	
	}
}
