# Developer Guide

## End-to-End System Flow

The complete EdgeVerify authentication pipeline is:

```text
User
 │
 ▼
Camera Preview
 │
 ▼
Face Detection (ML Kit)
 │
 ▼
Liveness Verification
(Blink → Smile → Left → Center → Right)
 │
 ▼
Face Capture
 │
 ▼
Face Crop
 │
 ▼
Face Resize (112×112)
 │
 ▼
MobileFaceNet (TensorFlow Lite)
 │
 ▼
192-Dimensional Face Embedding
 │
 ├── Registration
 │       │
 │       ▼
 │   AsyncStorage
 │
 └── Verification
         │
         ▼
  Cosine Similarity
         │
         ▼
 Authentication Result
```

---

# Why Each Module Exists

## 1. Camera Module

Purpose:

* Shows live camera preview
* Captures employee face image
* Provides pixel buffer to the AI pipeline

Key Technology:

* react-native-vision-camera

Why needed:

The face recognition model requires image data from the camera.

---

## 2. Face Detection

Purpose:

* Detects face position
* Provides bounding box coordinates

Output Example:

```text
x = 203
y = 417
width = 371
height = 378
```

Key Technology:

* Google ML Kit Face Detection

Why needed:

The recognition model should only process the face region, not the entire image.

---

## 3. Liveness Detection

Purpose:

Prevent spoofing attacks using:

* Printed photographs
* Mobile screen replays
* Static images

Current checks:

1. Blink
2. Smile
3. Head Left
4. Head Center
5. Head Right

Why needed:

A face photo alone should never be enough for authentication.

---

## 4. Capture Photo Screen

Purpose:

Capture a high-quality face image after liveness passes.

Main Responsibilities:

* Take photo
* Extract pixel buffer
* Generate face embedding
* Save employee record
* Verify employee identity

Why needed:

This is the entry point into the recognition pipeline.

---

## 5. Face Crop Module

Purpose:

Crop only the face area from the captured image.

Example:

```text
Original Image
1740 × 2320

Face Region
529 × 528
```

Why needed:

Removing background improves recognition consistency.

---

## 6. Face Resize Module

Purpose:

Resize cropped face to:

```text
112 × 112
```

Why needed:

MobileFaceNet expects a fixed input size.

Without resizing:

```text
Model Inference Fails
```

---

## 7. MobileFaceNet Model

Purpose:

Convert face image into a numerical representation.

Input:

```text
112 × 112 RGB Face
```

Output:

```text
192-Dimensional Embedding
```

Example:

```text
[
  -0.008,
   0.038,
   0.016,
   ...
]
```

Why needed:

Comparing raw images is unreliable.

Embeddings provide a compact mathematical representation of a face.

---

## 8. Embedding Generation

Purpose:

Generate unique facial features.

Function:

```text
generateEmbedding()
```

Output:

```text
192 Numbers
```

Why needed:

These embeddings are stored instead of face images.

Benefits:

* Smaller storage
* Better privacy
* Faster comparison

---

## 9. Registration Flow

Purpose:

Enroll new personnel.

Steps:

1. Pass liveness
2. Capture image
3. Generate embedding
4. Save locally

Stored Fields:

```text
Employee ID
Employee Name
Embedding
Timestamp
Network Status
Sync Status
```

---

## 10. Verification Flow

Purpose:

Authenticate personnel.

Steps:

1. Pass liveness
2. Capture face
3. Generate embedding
4. Load stored embedding
5. Compare embeddings

Output:

```text
Score = 0.92
Verified ✓
```

Why needed:

Authentication is based on mathematical similarity rather than image matching.

---

## 11. Cosine Similarity

Purpose:

Compare two embeddings.

Function:

```text
compareEmbeddings()
```

Example:

```text
0.95 = Same Person
0.45 = Different Person
```

Current Threshold:

```text
0.80
```

Why needed:

Determines whether the captured face belongs to the registered employee.

---

## 12. Local Storage

Purpose:

Store records when internet is unavailable.

Technology:

* AsyncStorage

Stores:

* Employees
* Verification records

Why needed:

The system must work completely offline.

---

## 13. Network Detection

Purpose:

Detect online/offline state.

Technology:

* NetInfo

Outputs:

```text
ONLINE
OFFLINE
```

Why needed:

Controls sync behavior.

---

## 14. Sync & Purge

Purpose:

Synchronize records when connectivity returns.

Current Prototype:

```text
Local Records
      │
      ▼
Simulated AWS Upload
      │
      ▼
Local Purge
```

Why needed:

Required by the hackathon specification.

Future Version:

```text
AWS API
      │
      ▼
Successful Upload
      │
      ▼
Purge Local Records
```

---

# Important Design Decisions

## Why store embeddings instead of images?

Advantages:

* Smaller storage
* Faster comparison
* Better privacy

---

## Why perform liveness before capture?

Advantages:

* Reduces spoof attacks
* Avoids unnecessary processing

---

## Why MobileFaceNet?

Advantages:

* Lightweight
* Mobile-friendly
* Fast inference
* Suitable for offline devices

---

# Future Improvements

* AWS Integration
* AES-256 Storage Encryption
* Background Sync
* Advanced Anti-Spoofing
* Multi-Face Support
* Benchmarking Dashboard

```
```
# Engineering Challenges & Solutions

## Challenge 1: Face Bounding Box Did Not Match Captured Image

### Problem

ML Kit provided face coordinates from the camera preview, but the captured photo had a different resolution.

Example:

```text
Preview:
1080 × 1920

Captured Photo:
1740 × 2320
```

As a result, the wrong area was cropped and the recognition model received incorrect facial regions.

### Solution

A coordinate scaling layer was implemented to map face coordinates from preview space into captured image space.

Additional margins were added around the detected face to ensure the complete facial region was included.

### Result

* Stable face crops
* Improved embedding consistency
* Better verification accuracy

---

## Challenge 2: Full Image Processing Produced Poor Embeddings

### Problem

Initially the entire camera image was passed into the recognition model.

The model received:

```text
Face
Background
Walls
Lighting Variations
```

which reduced embedding quality.

### Solution

A face-only crop pipeline was introduced:

```text
Face Detection
    ↓
Face Crop
    ↓
112 × 112 Resize
    ↓
MobileFaceNet
```

### Result

* Cleaner embeddings
* Faster inference
* More reliable verification scores

---

## Challenge 3: Spoofing Risk

### Problem

A printed photograph or image displayed on another device could potentially be presented to the camera.

### Solution

A multi-step liveness workflow was implemented:

1. Blink Detection
2. Smile Detection
3. Head Turn Left
4. Head Center
5. Head Turn Right

### Result

Authentication requires active user participation rather than a static image.

---

## Challenge 4: Operating Without Internet Connectivity

### Problem

Remote locations often have no mobile data or unstable network access.

Cloud-based face verification was therefore unsuitable.

### Solution

All processing was moved on-device:

```text
Face Detection
Liveness Detection
Embedding Generation
Verification
Storage
```

### Result

The complete authentication pipeline functions offline.

---

## Challenge 5: Storage Constraints

### Problem

Storing face images increases storage usage and privacy risks.

### Solution

Only 192-dimensional face embeddings are stored.

Face photographs are discarded after processing.

### Result

* Reduced storage requirements
* Better privacy
* Faster comparisons

---

## Challenge 6: Duplicate Employee Enrollment

### Problem

The same employee could accidentally be enrolled multiple times.

### Solution

Employee IDs are validated before storage.

Duplicate IDs trigger an error:

```text
Employee ID already exists
```

### Result

Consistent employee records.

---

## Challenge 7: Offline-to-Online Data Transition

### Problem

Authentication records generated offline must eventually reach the backend.

### Solution

A Sync & Purge workflow was designed:

```text
Local Storage
      ↓
Cloud Sync
      ↓
Purge Local Records
```

Current prototype simulates AWS synchronization.

### Result

Architecture is ready for backend integration.

---

## Challenge 8: Mobile Device Performance

### Problem

The solution must operate on standard mid-range devices.

### Solution

MobileFaceNet was selected because:

* Lightweight architecture
* Fast inference
* Mobile optimization
* TensorFlow Lite support

### Result

Face embedding generation typically completes in less than one second.

---

# Key Engineering Decisions

## Why React Native?

* Single codebase
* Android support
* iOS support
* Faster development

---

## Why ML Kit Face Detection?

* Offline operation
* Mobile optimized
* Accurate face landmarks
* Lightweight

---

## Why TensorFlow Lite?

* Runs on-device
* No server dependency
* Fast inference
* Cross-platform support

---

## Why MobileFaceNet?

* Small model size
* Mobile-friendly
* Suitable for edge AI deployments

---

## Why AsyncStorage?

* Simple local persistence
* Offline capability
* Lightweight integration

---

## Why NetInfo?

* Detects connectivity restoration
* Enables Sync & Purge workflow

---

# Lessons Learned

During development, the most difficult part was not face recognition itself, but ensuring that:

1. Face crops remained consistent across different camera resolutions.
2. Liveness verification prevented spoofing attempts.
3. The complete pipeline remained functional without internet connectivity.
4. Processing remained lightweight enough for mid-range mobile devices.

The project demonstrated that reliable offline biometric authentication can be achieved entirely on-device using open-source technologies.
