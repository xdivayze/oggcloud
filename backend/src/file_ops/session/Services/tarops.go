package services

import (
	"archive/tar"
	"bufio"
	"compress/gzip"
	"fmt"
	"io"
	"log"
	"oggcloudserver/src/db"
	"oggcloudserver/src/file_ops/file"
	"os"
	"sync"

	"github.com/google/uuid"
)

func extractFile(tarReader *tar.Reader, header *tar.Header, wg *sync.WaitGroup, errChan chan<- error, index int, sid uuid.UUID) {
	defer wg.Done()

	outfilename := fmt.Sprintf("%s_%d.hex", header.Name, index)
	outFilePath := fmt.Sprintf("%s/%s", DirectorySession, outfilename)
	outFile, err := os.Create(outFilePath)
	if err != nil {
		errChan <- fmt.Errorf("error occured while creating file at path %s:\n\t%w", outFilePath, err)
		return
	}
	defer outFile.Close()
	bufr := bufio.NewReader(tarReader)
	bufw := bufio.NewWriter(outFile)
	if _, err = io.Copy(bufw, bufr); err != nil {
		errChan <- fmt.Errorf("error occured while writing from reader to file:\n\t%w", err)
		return
	}
	if err = bufw.Flush(); err != nil {
		errChan <- fmt.Errorf("error occured while flushing buffered writer:\n\t%w", err)
		return
	}
	id := uuid.New()
	fileObj := file.File{
		ID:        id,
		FileName:  outfilename,
		Size:      header.FileInfo().Size(),
		SessionID: sid,
	}
	if res := db.DB.Create(&fileObj); res.Error != nil {
		errChan <- fmt.Errorf("error occured while saving to db:\n\t%w", err)
		return
	}
}

func extractTarGz(r io.Reader, sid uuid.UUID) error {
	gzipReader, err := gzip.NewReader(r)
	index := 0
	if err != nil {
		return fmt.Errorf("error occured while creating new gzip reader:\n\t%w", err)
	}
	defer gzipReader.Close()

	tarReader := tar.NewReader(gzipReader)

	var wg sync.WaitGroup
	errChan := make(chan error, 10)

	for {
		header, err := tarReader.Next()
		if err == io.EOF {
			log.SetPrefix("INFO: ")
			log.Println("archive end reached")
			break
		} else if err != nil {
			return fmt.Errorf("error occured while reading the next entry in tar reader:\n\t%v", err)
		}
		wg.Add(1)
		index += 1
		go extractFile(tarReader, header, &wg, errChan, index, sid)

	}
	wg.Wait()
	close(errChan)
	for err := range errChan {
		if err != nil {
			return fmt.Errorf("error occured while extracting from tar:\n\t%w", err)
		}
	}
	return nil
}
