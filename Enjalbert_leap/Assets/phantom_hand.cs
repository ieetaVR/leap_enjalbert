﻿using UnityEngine;
using System.Collections;
using Leap;

public class phantom_hand : MonoBehaviour {

    public int currentLevel;
    public Vector3 startingPos = new Vector3(0.021f, 0.037f, 0.029f);
    Vector3 myStartingPos = new Vector3(0.3f, -0.5f, 0.6f);
    public Vector3 endPos = new Vector3(0.021f, 0.111f, 0.029f);
    public float movementSpeed;
    public bool mustMove;
    public bool mustGrab;
    public bool mustRotate = false;


    public Leap.Unity.RigidHand phantomHand;


    public Transform topBar;

	// Use this for initialization
	void Start () {
        switch (currentLevel)
        {
            case 1:
                Debug.Log("phantom hand start pos: " + transform.position.ToString());
                //mustMove = true;
                break;

            default:
                break;
        }
	
	}

    public void moveToStart()
    {
        transform.position = myStartingPos;
    }
    
    

	// Update is called once per frame
	void Update () {
	
        if(mustMove == true)
        {
            //Debug.Log("phantom hand pos y: " + this.gameObject.transform.position.y);
            //this.gameObject.transform.Translate(0, -movementSpeed, 0);

            float step = movementSpeed * Time.deltaTime;
            transform.position = Vector3.MoveTowards(transform.position, topBar.position, step);
            if(mustRotate)
            {
                transform.Rotate(new Vector3(0, -1, 0), 1f);
            }

            if (this.gameObject.transform.position.y >= topBar.position.y)
            {
                mustMove = false;
                this.GetComponent<Renderer>().material.color = new Color(1, 0, 0, 1);
            }
        }
        else if(mustGrab == true)
        {
            Hand me = new Hand();
            me.GrabAngle = 3.14f;
            
        }

	}
}
