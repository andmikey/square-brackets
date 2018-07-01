var json_string = JSON.parse(`{"url": "foo.com",
 "ssl": {"algorithm": "sha256WithRSAEncryption",
	 "not_before": "20180607220149Z",
	 "not_after": "20190608220149Z",
	 "issuer": {"C": "BE",
		    "O": "GlobalSign nv-sa",
		    "CN": "GlobalSign CloudSSL CA - SHA256 - G3"}},
 "dpo_contact": "dpo@foo.com",
 "privacy_policy_url": "foo.com/privacy",
 "unchecked_by_default": true,
 "equal_emphasis": true,
 "change_later": true,
 "data_update_url": "foo.com/data_update",
 "data_portability_url": "foo.com/data_portability",
 "data_deletion_url": "foo.com/data_deletion",
 "subject_access_request_url": "foo.com/sar",
 "trackers": ["foo.com/tracker"]}`);


// window.alert(json_string["ssl"]["algorithm"]);
